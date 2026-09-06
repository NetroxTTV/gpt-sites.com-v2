import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ Reveal */
export const Reveal = ({ children, delay = 0, className, as: Tag = "div", ...rest }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={cn("reveal", visible && "is-visible", className)} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
};

/* --------------------------------------------------------- AnimatedBackdrop */
export const AnimatedBackdrop = ({ className }) => (
  <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
    <div className="absolute inset-0 grid-bg grid-anim" />
    <div className="orb orb-a" />
    <div className="orb orb-b" />
    <div className="orb orb-c" />
  </div>
);

/* ---------------------------------------------------------------- SiteLogo */
export const SiteLogo = ({ src, name, size = 48, className, rounded = "rounded-xl" }) => {
  const [error, setError] = useState(false);
  const initials = (name || "?").replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase();

  if (!src || error) {
    return (
      <div
        className={cn(rounded, "grid shrink-0 place-items-center border border-border bg-surface2 font-display font-bold text-brand-ink", className)}
        style={{ width: size, height: size, fontSize: size * 0.34 }}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setError(true)}
      className={cn(rounded, "shrink-0 object-contain bg-white/90 dark:bg-white/[0.06] p-1", className)}
      style={{ width: size, height: size }}
    />
  );
};

/* ----------------------------------------------------------------- Eyebrow */
export const Eyebrow = ({ children, className, dot = "brand" }) => (
  <span className={cn("eyebrow", className)}>
    {dot === "live" ? <span className="live-dot" /> : <span className="eyebrow-dot" />}
    {children}
  </span>
);

/* ----------------------------------------------------------- SectionHeader */
export const SectionHeader = ({ eyebrow, title, subtitle, align = "center", className, children }) => (
  <div className={cn("mb-12 md:mb-16", align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
    {eyebrow && <Eyebrow className={align === "center" ? "mx-auto" : ""}>{eyebrow}</Eyebrow>}
    <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.08]">{title}</h2>
    {subtitle && <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{subtitle}</p>}
    {children}
  </div>
);

/* -------------------------------------------------------------- PageHeader */
export const PageHeader = ({ eyebrow, title, subtitle, children, aside, live = false }) => (
  <section className="relative overflow-hidden border-b border-border">
    <AnimatedBackdrop className="opacity-80" />
    <div className="container-x relative py-14 md:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <Eyebrow dot={live ? "live" : "brand"}>{eyebrow}</Eyebrow>}
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.02]">{title}</h1>
          {subtitle && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{subtitle}</p>}
          {children}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </div>
  </section>
);

/* --------------------------------------------------------------- TagBadge */
const TAG_STYLES = {
  top: "bg-brand text-brand-fg border-transparent",
  new: "bg-mint-soft text-mint border-mint/30",
  popular: "bg-amber-soft text-amber border-amber/30",
  mobile: "bg-sky-500/10 text-sky-500 border-sky-500/25",
  casino: "bg-rose-soft text-rose border-rose/30",
};

export const TagBadge = ({ tag, label, className }) => {
  if (!tag) return null;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide", TAG_STYLES[tag] || "bg-secondary text-foreground", className)}>
      {label}
    </span>
  );
};

export const BonusBadge = ({ children, className }) => (
  <span className={cn("inline-flex items-center gap-1 rounded-full border border-amber/30 bg-amber-soft px-2.5 py-0.5 text-[11px] font-semibold text-amber", className)}>
    <span className="h-1.5 w-1.5 rounded-full bg-amber" />
    {children}
  </span>
);

/* -------------------------------------------------------------- RateMeter */
/* Rate tiers: <=50% red, <60% yellow, otherwise green. */
export const rateTone = (rates) => {
  const max = rates?.max ?? 0;
  if (max <= 50) return { bar: "bg-rose", text: "text-rose" };
  if (max < 60) return { bar: "bg-amber", text: "text-amber" };
  return { bar: "bg-mint", text: "text-mint" };
};

export const RateMeter = ({ rates, compact = false }) => {
  if (!rates) return <span className="text-xs text-muted-foreground">-</span>;
  const label = rates.min === rates.max ? `${rates.max}%` : `${rates.min}-${rates.max}%`;
  const tone = rateTone(rates);
  return (
    <div className={cn("flex items-center gap-2", compact ? "w-28" : "w-full")}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full rounded-full", tone.bar)} style={{ width: `${Math.min(rates.max, 100)}%` }} />
      </div>
      <span className={cn("font-mono text-xs font-semibold", tone.text)}>{label}</span>
    </div>
  );
};

/* ------------------------------------------------------------- Stars */
export const Stars = ({ value = 5 }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} / 5`}>
    {[1, 2, 3, 4, 5].map((n) => {
      const i = n - 1;
      const filled = n <= Math.floor(value);
      const half = !filled && i < value;
      return (
        <svg key={`star-${n}`} viewBox="0 0 20 20" className={cn("h-3.5 w-3.5", filled || half ? "text-amber" : "text-border")} fill="currentColor">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8L10 1.5z" opacity={half ? 0.55 : 1} />
        </svg>
      );
    })}
  </div>
);
