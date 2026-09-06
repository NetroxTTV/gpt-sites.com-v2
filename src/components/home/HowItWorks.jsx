import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MousePointerClick, Target, Zap } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { Reveal, SectionHeader, SiteLogo } from "@/components/shared/Primitives";
import { SITES } from "@/data/mock";

export const LogoMarquee = () => {
  const { t } = useLang();
  const logos = SITES.filter((s) => s.tag === "top" || s.tag === "popular" || s.tag === "new").slice(0, 18);
  const row = [...logos, ...logos];
  return (
    <section className="border-y border-border bg-surface/40 py-8" data-testid="logo-marquee">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{t("marquee.label")}</p>
      <div className="marquee-mask overflow-hidden">
        <div className="marquee flex w-max items-center gap-10 px-5">
          {row.map((s, i) => (
            <a key={`${s.id}-${i}`} href={s.url} target="_blank" rel="noreferrer nofollow" className="flex items-center gap-2.5 opacity-60 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0">
              <SiteLogo src={s.logo} name={s.name} size={32} rounded="rounded-lg" />
              <span className="whitespace-nowrap font-display text-sm font-bold">{s.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const STEPS = [
  { n: "01", icon: MousePointerClick, to: "/Sites", keys: ["s1t", "s1d", "s1c"] },
  { n: "02", icon: Target, to: "/Guides", keys: ["s2t", "s2d", "s2c"] },
  { n: "03", icon: Zap, to: "/Events", keys: ["s3t", "s3d", "s3c"] },
];

const HowItWorks = () => {
  const { t } = useLang();
  return (
    <section id="how-it-works" className="container-x scroll-mt-24 py-24 md:py-32" data-testid="how-it-works">
      <Reveal>
        <SectionHeader eyebrow={t("how.label")} title={t("how.title")} subtitle={t("how.subtitle")} />
      </Reveal>
      <div className="grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 100}>
            <Link to={s.to} className="group card-surface relative flex h-full flex-col p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-[0_24px_60px_-28px_var(--glow-strong)]" data-testid={`how-step-${i + 1}`}>
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand-ink transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-fg"><s.icon className="h-5 w-5" /></span>
                <span className="font-mono text-sm font-semibold text-muted-foreground/60">{s.n}</span>
              </div>
              <h3 className="mt-7 font-display text-xl font-bold tracking-tight">{t(`how.${s.keys[0]}`)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t(`how.${s.keys[1]}`)}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
                {t(`how.${s.keys[2]}`)} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
