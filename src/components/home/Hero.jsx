import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Layers, ShieldCheck, Sparkles, Trophy, Users, Globe2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import { DiscordButton } from "@/components/layout/Navbar";
import { AnimatedBackdrop, SiteLogo } from "@/components/shared/Primitives";
import { SITES, STATS, getSiteById } from "@/data/mock";
import { EVENTS } from "@/data/content";
import { useFeedItems } from "@/hooks/useLiveFeed";
import { fmtMoney, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

const RotatingWord = ({ words }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className="relative inline-block align-baseline text-cyan">
      <span key={words[i]} className="word-in inline-block">{words[i]}</span>
      <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-cyan opacity-50 md:-bottom-2 md:h-1" />
    </span>
  );
};

const LiveTicker = () => {
  const { t } = useLang();
  // Real activity from the shared feed store; cycle through the freshest items.
  const { items } = useFeedItems();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((v) => v + 1), 4200);
    return () => clearInterval(id);
  }, []);
  const pool = items.slice(0, 8);
  const item = pool[idx % Math.max(pool.length, 1)];
  if (!item) return null;
  return (
    <div className="float-slow glass absolute -right-3 -top-6 z-20 hidden w-[260px] rounded-2xl p-4 shadow-2xl shadow-black/30 sm:block lg:-right-8" data-testid="hero-live-card">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-mint"><span className="live-dot" />{t("hero.liveNow")}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{timeAgo(item.time, t)}</span>
      </div>
      <div key={`${item.id}-${idx}`} className="word-in mt-3 flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary font-display text-xs font-bold uppercase">{item.user.slice(0, 2)}</div>
        <p className="text-sm leading-snug">
          <span className="font-semibold">@{item.user}</span> <span className="text-muted-foreground">{t("hero.cashedOut")}</span> <span className="font-mono font-bold text-brand-ink">{fmtMoney(item.amount)}</span>
          <span className="block text-xs text-muted-foreground">{item.source} · {item.wall}</span>
        </p>
      </div>
    </div>
  );
};

const EarningsPanel = () => {
  const { t } = useLang();
  const top = useMemo(() => SITES.filter((s) => s.tag === "top").sort((a, b) => a.rank - b.rank).slice(0, 5), []);
  const boost = EVENTS.find((e) => e.type === "boost") || EVENTS[0];
  const boostSite = boost ? getSiteById(boost.siteId) : null;
  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:ml-auto">
      <LiveTicker />
      <div className="card-surface relative z-10 overflow-hidden p-5 shadow-2xl shadow-black/20 sm:p-6" data-testid="hero-top-sites-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full" style={{ background: "var(--glow)" }} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="font-display text-sm font-bold">{t("hero.topSites")}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t("hero.topSitesSub")}</p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand-ink"><Trophy className="h-4 w-4" /></span>
        </div>
        <ol className="relative mt-5 space-y-2.5">
          {top.map((s, i) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer nofollow"
                data-testid={`hero-top-site-${s.id}`}
                className="group flex items-center gap-3 rounded-xl border border-border/70 bg-background/50 p-2.5 pr-3 transition-colors hover:border-brand/50 hover:bg-brand-soft"
              >
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold", i === 0 ? "bg-brand text-brand-fg" : "bg-secondary text-muted-foreground")}>{i + 1}</span>
                <SiteLogo src={s.logo} name={s.name} size={36} rounded="rounded-lg" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{s.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{s.bonus ? s.bonus : s.tagline.split("|")[1]?.trim() || s.tagline.split("|")[0].trim()}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ol>
      </div>
      {boost && (
        <div className="float-slower glass absolute -bottom-7 -left-3 z-20 hidden w-[260px] rounded-2xl p-4 shadow-2xl shadow-black/30 sm:block lg:-left-10" data-testid="hero-boost-card">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-soft text-amber"><Zap className="h-4 w-4" /></span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber">{t("hero.boostActive")}</p>
              <p className="truncate text-sm font-semibold" title={boost.title}>{boost.title}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">{boost.daysLeft} {t("hero.daysLeft")}</span>
            <span>{boostSite?.name}</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-amber" style={{ width: `${boost.remaining}%` }} /></div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ icon: Icon, value, label, delay }) => (
  <div className="fade-up flex items-center gap-4 p-5 sm:p-6" style={{ animationDelay: `${delay}ms` }}>
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-ink"><Icon className="h-5 w-5" /></span>
    <div>
      <p className="font-display text-2xl font-extrabold leading-none tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
    </div>
  </div>
);

const Hero = () => {
  const { t } = useLang();
  const words = t("hero.words");
  return (
    <section className="relative overflow-hidden" data-testid="hero">
      <AnimatedBackdrop />
      <div className="container-x relative pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 text-center md:text-left lg:col-span-7">
            <span className="fade-up inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand-ink">
              <Sparkles className="h-3.5 w-3.5" /> {t("hero.badge")} · {STATS.sites}+ sites
            </span>
            <h1 className="fade-up mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl" style={{ animationDelay: "80ms" }}>
              {t("hero.titleA")}<br />
              <RotatingWord words={words} />
            </h1>
            <p className="fade-up mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:mx-0" style={{ animationDelay: "160ms" }}>{t("hero.subtitle")}</p>
            <div className="fade-up mt-9 flex flex-wrap items-center justify-center gap-3 md:justify-start" style={{ animationDelay: "240ms" }}>
              <Button asChild size="lg" className="h-12 gap-2 px-6 text-base font-semibold shadow-[0_10px_30px_-12px_var(--glow-strong)]">
                <Link to="/Sites" data-testid="hero-browse-sites">{t("hero.ctaBrowse")} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 gap-2 px-6 text-base font-semibold">
                <a href="#how-it-works" data-testid="hero-how-it-works">{t("hero.ctaHow")} <ArrowDown className="h-4 w-4" /></a>
              </Button>
              <DiscordButton size="lg" className="h-12 px-6 text-base font-semibold" label={t("hero.ctaDiscord")} />
            </div>
          </div>
          <div className="fade-up hidden min-w-0 md:block lg:col-span-5" style={{ animationDelay: "200ms" }} data-testid="hero-panel">
            <EarningsPanel />
          </div>
        </div>

        <div className="mt-12 grid divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x md:mt-28" data-testid="hero-stats">
          <Stat icon={Globe2} value={`${STATS.sites}+`} label={t("hero.statSites")} delay={300} />
          <Stat icon={Layers} value={`${STATS.offerwalls}+`} label={t("hero.statWalls")} delay={360} />
          <Stat icon={ShieldCheck} value={t("hero.statFree")} label={t("hero.statFreeSub")} delay={420} />
          <Stat icon={Users} value={t("hero.statCommunity")} label={t("hero.statCommunitySub")} delay={480} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
