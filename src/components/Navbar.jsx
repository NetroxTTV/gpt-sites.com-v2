import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Flame, Globe, HelpCircle, Home, Lightbulb, Menu, Moon, Radio, Sun, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { NavHeader } from "@/components/ui/nav-header";
import { useLocation } from "react-router-dom";

const mobileNavLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Sites", href: "/Sites", icon: Globe },
  { label: "Events", href: "/Events", icon: Flame },
  { label: "Live Feed", href: "/LiveFeed", icon: Radio },
  { label: "Guides", href: "/Guides", icon: BookOpen },
  { label: "Tips", href: "/Tips", icon: Lightbulb },
  { label: "FAQ", href: "/#faq", icon: HelpCircle, isFaq: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const resolvedTheme =
      storedTheme === "dark" || storedTheme === "light" ? storedTheme : "dark";
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.style.colorScheme = resolvedTheme;
    setTheme(resolvedTheme);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
  };

  const handleFaqClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById("faq");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = "/#faq";
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Sites", href: "/Sites" },
    { label: "Events", href: "/Events" },
    { label: "Live Feed", href: "/LiveFeed" },
    { label: "Guides", href: "/Guides" },
    { label: "Tips", href: "/Tips" },
    { label: "FAQ", href: "/#faq", onClick: handleFaqClick },
  ];

  const isLight = theme === "light";

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? isLight
            ? "border-b border-sky-200/60 bg-[rgba(255,255,255,0.92)] backdrop-blur-2xl shadow-[0_1px_0_rgba(148,163,184,0.35),0_10px_30px_rgba(59,130,246,0.12)]"
            : "border-b border-white/[0.06] bg-[rgba(3,7,14,0.82)] backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.4)]"
          : isLight
            ? "border-b border-transparent bg-[rgba(255,255,255,0.78)] backdrop-blur-xl"
            : "border-b border-transparent bg-[rgba(3,7,14,0.55)] backdrop-blur-xl",
      ].join(" ")}
    >
      {/* Bottom glow line */}
      <div
        className={[
          "absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px pointer-events-none",
          isLight
            ? "bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
            : "bg-gradient-to-r from-transparent via-primary/40 to-transparent",
        ].join(" ")}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 group-hover:shadow-[0_0_14px_hsl(var(--primary)/0.35)] transition-all duration-200">
              <img
                src={new URL("../icon.png", import.meta.url).href}
                alt="GPTSites"
                className="w-5 h-5"
              />
            </div>
            <span className="text-[1.1rem] font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">GPT</span>
              <span className="text-foreground">Sites</span>
            </span>
          </a>

          {/* Desktop nav — absolutely centered */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <NavHeader />
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <a href="https://discord.gg/gptfr" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 cursor-pointer border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 hover:border-indigo-400/50 hover:shadow-[0_0_18px_rgba(99,102,241,0.3)] transition-all duration-300"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                </svg>
                Discord
              </Button>
            </a>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="cursor-pointer w-8 h-8 border-white/[0.1] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200"
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className={[
              "md:hidden cursor-pointer p-2 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              isLight ? "hover:bg-sky-100/70" : "hover:bg-white/[0.06]",
            ].join(" ")}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — portaled to body so the navbar's backdrop-filter
          doesn't trap its fixed positioning (which left it under the page) */}
      {createPortal(
        <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className={[
                "fixed right-0 top-0 bottom-0 z-[60] w-[280px] flex flex-col md:hidden overflow-y-auto",
                isLight
                  ? "bg-[rgba(248,250,252,0.98)] border-l border-sky-200/70"
                  : "bg-[rgba(3,7,14,0.98)] border-l border-white/[0.08]",
              ].join(" ")}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.06] flex-shrink-0">
                <a href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/15 border border-primary/25 flex items-center justify-center">
                    <img
                      src={new URL("../icon.png", import.meta.url).href}
                      alt="GPTSites"
                      className="w-3.5 h-3.5"
                    />
                  </div>
                  <span className="text-base font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">GPT</span>
                    <span className="text-foreground">Sites</span>
                  </span>
                </a>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {mobileNavLinks.map((link) => {
                  const isActive = link.href === "/"
                    ? location.pathname === "/" || location.pathname === "/Home"
                    : location.pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        if (link.isFaq) {
                          e.preventDefault();
                          setMobileOpen(false);
                          const el = document.getElementById("faq");
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                          else window.location.href = "/#faq";
                        } else {
                          setMobileOpen(false);
                        }
                      }}
                      className={[
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer",
                        isActive
                          ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_12px_hsl(var(--primary)/0.1)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]",
                      ].join(" ")}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                      <span className="flex-1">{link.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </a>
                  );
                })}
              </nav>

              {/* Bottom section */}
              <div className="px-3 pb-6 pt-3 border-t border-white/[0.06] space-y-2 flex-shrink-0">
                <a
                  href="https://discord.gg/gptfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/15 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400 flex-shrink-0">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-indigo-400 leading-tight">Join Discord</p>
                    <p className="text-xs text-indigo-400/60 leading-tight">Tips, events &amp; community</p>
                  </div>
                </a>

                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all text-sm font-medium cursor-pointer"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
                </button>
              </div>
            </motion.div>
          </>
        )}
        </AnimatePresence>,
        document.body
      )}
    </nav>
  );
}
