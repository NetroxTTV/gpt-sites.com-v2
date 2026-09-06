import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, BookOpen, Globe2, Home, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/i18n/LanguageContext";

// Five primary destinations only - Tips/FAQ/Discord/language stay in the
// hamburger Sheet menu (see Navbar.jsx) to keep touch targets comfortable.
const ITEMS = [
  { to: "/", key: "home", icon: Home },
  { to: "/Sites", key: "sites", icon: Globe2 },
  { to: "/Events", key: "events", icon: Zap },
  { to: "/LiveFeed", key: "liveFeed", icon: Activity },
  { to: "/Guides", key: "guides", icon: BookOpen },
];

const LABEL_WIDTH = 64;

const isItemActive = (pathname, to) => (to === "/" ? pathname === "/" || pathname === "/Home" : pathname.startsWith(to));

export const BottomNavBar = ({ className }) => {
  const { t } = useLang();
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Primary"
      data-testid="bottom-nav-bar"
      className={cn(
        "fixed inset-x-0 bottom-4 z-40 mx-auto flex h-[52px] w-fit max-w-[95vw] items-center space-x-1 rounded-full border border-border bg-card p-2 shadow-xl shadow-black/20 lg:hidden",
        className
      )}
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isItemActive(pathname, item.to);
        const label = t(`nav.${item.key}`);
        return (
          <Link key={item.to} to={item.to} aria-label={label} aria-current={active ? "page" : undefined} data-testid={`bottom-nav-${item.key}`}>
            <motion.span
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex h-10 min-h-[40px] max-h-[44px] min-w-[44px] items-center rounded-full px-3 py-2 transition-colors duration-200",
                active ? "gap-2 bg-brand text-brand-fg" : "gap-0 bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon size={20} strokeWidth={2} aria-hidden className="shrink-0" />
              <motion.span
                initial={false}
                animate={{ width: active ? LABEL_WIDTH : 0, opacity: active ? 1 : 0 }}
                transition={{ width: { type: "spring", stiffness: 350, damping: 32 }, opacity: { duration: 0.19 } }}
                className="flex items-center overflow-hidden"
              >
                <span className="whitespace-nowrap text-xs font-semibold">{label}</span>
              </motion.span>
            </motion.span>
          </Link>
        );
      })}
    </motion.nav>
  );
};

export default BottomNavBar;
