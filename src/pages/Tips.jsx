import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Camera, ExternalLink, Gamepad2, Gift, Mail, Percent, Scale, Search, ShieldOff, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import { PageHeader, Reveal } from "@/components/shared/Primitives";
import { DiscordButton } from "@/components/layout/Navbar";
import { TIPS, L } from "@/data/content";

const ICONS = { Trophy, Gamepad2, Gift, Scale, BookOpen, Percent, Mail, ShieldOff, Camera, Target, Search };

const Tips = () => {
  const { t, lang } = useLang();
  return (
    <main data-testid="tips-page">
      <PageHeader eyebrow={t("tips.label")} title={t("tips.title")} subtitle={t("tips.subtitle")} />

      <section className="container-x py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" data-testid="tips-grid">
          {TIPS.map((tip, i) => {
            const Icon = ICONS[tip.icon] || Trophy;
            return (
              <Reveal key={tip.title.en} delay={(i % 3) * 70}>
                <article className="card-surface group relative flex h-full flex-col p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-brand/50" data-testid={`tip-card-${i + 1}`}>
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand-ink transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-fg"><Icon className="h-5 w-5" /></span>
                    <span className="font-mono text-sm font-semibold text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{L(tip.title, lang)}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{L(tip.text, lang)}</p>
                  {tip.link && (
                    <a href={tip.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink hover:underline">{t("tips.openLink")} gpthub.gg <ExternalLink className="h-3.5 w-3.5" /></a>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-20">
          <div className="card-surface relative overflow-hidden p-10 text-center md:p-14">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full blur-3xl" style={{ background: "var(--glow)" }} />
            <h2 className="relative font-display text-3xl font-extrabold tracking-tight md:text-4xl">{t("tips.ctaTitle")}</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">{t("tips.ctaSub")}</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gap-2 font-semibold"><Link to="/Sites">{t("tips.browse")} <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="font-semibold"><Link to="/Guides">{t("tips.openGuides")}</Link></Button>
            </div>
            <div className="relative mt-10 border-t border-border pt-8">
              <p className="text-sm text-muted-foreground">{t("tips.moreTitle")}</p>
              <div className="mt-4 flex justify-center"><DiscordButton label={t("tips.join")} /></div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
};

export default Tips;
