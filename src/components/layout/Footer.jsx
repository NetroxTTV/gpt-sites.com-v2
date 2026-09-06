import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Youtube } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { Logo, NAV_LINKS } from "./Navbar";
import { DISCORD_URL, STATS, OFFERWALLS } from "@/data/mock";
import { GUIDES } from "@/data/content";

const Footer = () => {
  const { t } = useLang();

  return (
    <footer className="relative mt-24 border-t border-border bg-surface" data-testid="footer">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">{t("footer.tagline")}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted-foreground">{STATS.sites}+ sites</span>
              <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted-foreground">{STATS.offerwalls} offerwalls</span>
              <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted-foreground">{GUIDES.length} guides</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("footer.navigate")}</h4>
              <ul className="mt-4 space-y-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-foreground/80 transition-colors hover:text-brand-ink">{t(`nav.${l.key}`)}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("footer.resources")}</h4>
              <ul className="mt-4 space-y-2.5">
                <li><Link to="/Faq" className="text-sm text-foreground/80 transition-colors hover:text-brand-ink">FAQ</Link></li>
                <li><Link to="/Sites" className="text-sm text-foreground/80 transition-colors hover:text-brand-ink">{t("footer.offerwalls")}</Link></li>
                <li><Link to="/Guides" className="text-sm text-foreground/80 transition-colors hover:text-brand-ink">{t("nav.guides")}</Link></li>
                <li><a href={DISCORD_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-brand-ink">{t("footer.contact")} <ExternalLink className="h-3 w-3" /></a></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("footer.community")}</h4>
              <ul className="mt-4 space-y-2.5">
                <li><a href={DISCORD_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-foreground/80 transition-colors hover:text-brand-ink">Discord <ExternalLink className="h-3 w-3" /></a></li>
                <li><a href={STATS.youtube} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-foreground/80 transition-colors hover:text-brand-ink"><Youtube className="h-3.5 w-3.5" /> YouTube</a></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="mt-14 border-t border-border pt-8">
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {OFFERWALLS.map((w) => (
              <span key={w} className="text-[11px] uppercase tracking-wider text-muted-foreground/70">{w}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} GPT Sites. {t("footer.rights")}</p>
            <p className="max-w-xl md:text-right">{t("footer.affiliate")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
