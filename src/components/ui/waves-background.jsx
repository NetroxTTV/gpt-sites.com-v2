import { useEffect, useRef } from "react";

/**
 * Mouse-reactive glowing waves rendered on a <canvas>.
 * Reads the site's HSL theme variables (e.g. --primary "210 82% 48%")
 * and re-resolves them whenever the theme (light/dark) changes.
 *
 * Drop it as an absolutely-positioned background layer behind hero content.
 */
export function WavesBackground({ className = "" }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let animationId;
    let time = 0;

    // Resolve a bare-HSL CSS variable (e.g. "210 82% 48%") to an rgba() string.
    const resolveColor = (variable, alpha = 1) => {
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;width:1px;height:1px";
      probe.style.backgroundColor = `hsl(var(${variable}))`;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).backgroundColor;
      document.body.removeChild(probe);

      const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return `rgba(56, 189, 248, ${alpha})`;
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
    };

    const computeTheme = () => ({
      bgTop: resolveColor("--background", 0),
      bgBottom: resolveColor("--background", 0),
      waves: [
        { offset: 0, amplitude: 70, frequency: 0.003, color: resolveColor("--primary", 1), opacity: 0.5 },
        { offset: Math.PI / 2, amplitude: 90, frequency: 0.0026, color: resolveColor("--accent", 1), opacity: 0.4 },
        { offset: Math.PI, amplitude: 60, frequency: 0.0034, color: resolveColor("--chart-4", 1), opacity: 0.32 },
        { offset: Math.PI * 1.5, amplitude: 80, frequency: 0.0022, color: resolveColor("--primary", 1), opacity: 0.22 },
        { offset: Math.PI * 2, amplitude: 55, frequency: 0.004, color: resolveColor("--accent", 1), opacity: 0.2 },
      ],
    });

    let theme = computeTheme();

    const observer = new MutationObserver(() => {
      theme = computeTheme();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouseInfluence = reducedMotion ? 10 : 70;
    const influenceRadius = reducedMotion ? 160 : 320;
    const smoothing = reducedMotion ? 0.04 : 0.1;

    const sizeToParent = () => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: rect.width, h: rect.height };
    };

    let { w, h } = sizeToParent();

    const recenter = () => {
      const center = { x: w / 2, y: h / 2 };
      mouseRef.current = { ...center };
      targetMouseRef.current = { ...center };
    };
    recenter();

    const handleResize = () => {
      ({ w, h } = sizeToParent());
      recenter();
    };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => recenter();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const drawWave = (wave) => {
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const dx = x - mouseRef.current.x;
        const dy = h / 2 - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / influenceRadius);
        const mouseEffect =
          influence * mouseInfluence * Math.sin(time * 0.001 + x * 0.01 + wave.offset);

        const y =
          h / 2 +
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) * (wave.amplitude * 0.45) +
          mouseEffect;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = wave.color;
      ctx.globalAlpha = wave.opacity;
      ctx.shadowBlur = 35;
      ctx.shadowColor = wave.color;
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      time += 1;
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * smoothing;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * smoothing;

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      theme.waves.forEach(drawWave);

      animationId = window.requestAnimationFrame(animate);
    };
    animationId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
