import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Check, ExternalLink, Globe, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { DISCORD_URL } from "@/data/mock";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { to: "/", key: "home" },
  { to: "/Sites", key: "sites" },
  { to: "/Events", key: "events" },
  { to: "/LiveFeed", key: "liveFeed" },
  { to: "/Guides", key: "guides" },
  { to: "/Tips", key: "tips" },
  { to: "/Faq", key: "faq" },
];

export const Logo = ({ className }) => (
  <Link to="/" className={cn("group flex items-center gap-2.5", className)} data-testid="nav-logo">
    <span className="relative inline-block transition-transform duration-300 group-hover:-rotate-6">
      <img src="/icon.png" alt="GPT Sites" className="h-9 w-9 rounded-xl object-contain" />
      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-mint ring-2 ring-background" />
    </span>
    <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
      GPT<span className="text-brand-ink">Sites</span>
    </span>
  </Link>
);

const DiscordIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.2.4a18 18 0 0 1 4.4 2.2 15 15 0 0 0-15.2 0 18 18 0 0 1 4.4-2.2L8.6 3a19.8 19.8 0 0 0-4.9 1.4C.6 9 0 13.5.3 17.9a20 20 0 0 0 6 3l1.3-2a12.7 12.7 0 0 1-2.1-1l.5-.4a14.3 14.3 0 0 0 12.2 0l.5.4c-.7.4-1.4.8-2.1 1l1.3 2a19.9 19.9 0 0 0 6-3c.4-5.1-.7-9.6-3.6-13.5zM8.7 15.2c-1.2 0-2.1-1.1-2.1-2.4s1-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4zm6.6 0c-1.2 0-2.1-1.1-2.1-2.4s1-2.4 2.1-2.4 2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4z" />
  </svg>
);

export const DiscordButton = ({ className, size = "default", label }) => (
  <Button asChild variant="outline" size={size} className={cn("gap-2 border-[#5865F2]/40 bg-[#5865F2]/10 text-foreground hover:bg-[#5865F2]/20", className)}>
    <a href={DISCORD_URL} target="_blank" rel="noreferrer" data-testid="discord-link">
      <DiscordIcon className="h-4 w-4 text-[#7289DA]" />
      {label}
    </a>
  </Button>
);

const LanguageSwitcher = () => {
  const { lang, setLang, languages, t } = useLang();
  const current = languages.find((l) => l.code === lang);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2.5 font-semibold" aria-label={t("nav.language")} data-testid="lang-switcher">
          <Globe className="h-4 w-4" />
          {current?.short}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {languages.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)} className="flex cursor-pointer items-center justify-between gap-3" data-testid={`lang-option-${l.code}`}>
            <span>{l.label}</span>
            {l.code === lang && <Check className="h-4 w-4 text-brand-ink" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  const { t } = useLang();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={t("nav.theme")} className="h-9 w-9" data-testid="theme-toggle">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

const navLinkClass = (variant) => ({ isActive }) =>
  variant === "pill"
    ? cn("rounded-full px-3.5 py-1.5 text-[13px] font-semibold tracking-wide transition-colors duration-200", isActive ? "bg-brand text-brand-fg" : "text-muted-foreground hover:bg-secondary hover:text-foreground")
    : cn("rounded-xl px-4 py-3 text-base font-semibold transition-colors", isActive ? "bg-brand text-brand-fg" : "text-foreground hover:bg-secondary");

const NavLinks = ({ variant }) => {
  const { t } = useLang();
  return NAV_LINKS.map((l) => (
    <NavLink key={l.to} to={l.to} end={l.to === "/"} data-testid={variant === "pill" ? `nav-link-${l.key}` : undefined} className={navLinkClass(variant)}>
      {t(`nav.${l.key}`)}
    </NavLink>
  ));
};

const MobileMenu = ({ open, onOpenChange }) => {
  const { t } = useLang();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" aria-label={t("nav.menu")} data-testid="mobile-menu-trigger">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] border-border bg-background p-0" aria-describedby={undefined}>
        <SheetTitle className="sr-only">{t("nav.menu")}</SheetTitle>
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-5"><Logo /></div>
          <nav className="flex flex-col gap-1 p-4"><NavLinks variant="list" /></nav>
          <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
            <Button asChild className="w-full font-semibold"><Link to="/Sites">{t("nav.browseSites")}</Link></Button>
            <DiscordButton className="w-full" label={t("nav.discord")} />
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              discord.gg/gptfr <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const useScrolled = (threshold = 8) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
};

const Navbar = () => {
  const { t } = useLang();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={cn("sticky top-0 z-50 border-b transition-colors duration-300", scrolled ? "border-border bg-background/80 backdrop-blur-xl" : "border-transparent bg-transparent")} data-testid="navbar">
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <Logo />
        <nav className="hidden items-center gap-1 rounded-full border border-border bg-surface/70 p-1 backdrop-blur lg:flex" aria-label="Main">
          <NavLinks variant="pill" />
        </nav>
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild size="sm" className="hidden font-semibold md:inline-flex">
            <Link to="/Sites" data-testid="nav-browse-sites">{t("nav.browseSites")}</Link>
          </Button>
          <DiscordButton size="sm" className="hidden md:inline-flex" label={t("nav.discord")} />
          <MobileMenu open={open} onOpenChange={setOpen} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
