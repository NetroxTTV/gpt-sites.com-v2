import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Sites", href: "/Sites" },
  { label: "Events", href: "/Events" },
  { label: "Live Feed", href: "/LiveFeed" },
  { label: "Guides", href: "/Guides" },
  { label: "Tips", href: "/Tips" },
  { label: "FAQ", href: "/#faq" },
];

export function NavHeader() {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
  const location = useLocation();

  const handleFaqClick = (e) => {
    e.preventDefault();
    const el = document.getElementById("faq");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = "/#faq";
    }
  };

  return (
    <ul
      className="relative flex w-fit rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {navLinks.map((link) => {
        const isActive =
          link.href === "/"
            ? location.pathname === "/" || location.pathname === "/Home"
            : location.pathname.startsWith(link.href) && link.href !== "/";

        return (
          <Tab
            key={link.label}
            href={link.href}
            isActive={isActive}
            setPosition={setPosition}
            onClick={link.label === "FAQ" ? handleFaqClick : undefined}
          >
            {link.label}
          </Tab>
        );
      })}
      <Cursor position={position} />
    </ul>
  );
}

function Tab({ children, href, isActive, setPosition, onClick }) {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
      }}
      className="relative z-10"
    >
      <a
        href={href}
        onClick={onClick}
        className={cn(
          "block cursor-pointer px-3.5 py-1.5 text-xs font-medium uppercase tracking-widest transition-colors duration-200 md:px-4 md:py-2 md:text-[11px]",
          isActive
            ? "text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {children}
      </a>
    </li>
  );
}

function Cursor({ position }) {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="absolute z-0 top-1 h-[calc(100%-8px)] rounded-full bg-primary/[0.12] border border-primary/25 shadow-[0_0_16px_hsl(var(--primary)/0.2)]"
    />
  );
}
