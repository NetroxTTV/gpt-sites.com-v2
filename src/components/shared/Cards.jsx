import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, ExternalLink, Flame, Layers, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLogo, TagBadge, BonusBadge, RateMeter } from "./Primitives";
import { useLang } from "@/i18n/LanguageContext";
import { L } from "@/data/content";
import { getSiteById, offerwallLabel } from "@/data/mock";
import { difficultyClass, difficultyKey, fmtMoney, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------- SiteCard */
export const SiteCard = ({ site, index = 0 }) => {
  const { t } = useLang();
  const tagLabel = site.tag ? t(`sites.${site.tag === "mobile" ? "mobile" : site.tag}`) : null;
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noreferrer nofollow"
      className="group card-surface relative flex flex-col gap-4 p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_18px_50px_-24px_var(--glow-strong)]"
      data-testid={`site-card-${site.id}`}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <SiteLogo src={site.logo} name={site.name} size={52} />
        <div className="flex flex-col items-end gap-1.5">
          {site.rank && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-brand-fg">
              <Trophy className="h-3 w-3" /> {t("sites.top")} {site.rank}
            </span>
          )}
          {site.tag && site.tag !== "top" && <TagBadge tag={site.tag} label={tagLabel} />}
          {site.bonus && <BonusBadge>{site.bonus}</BonusBadge>}
        </div>
      </div>
      <div>
        <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{site.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{site.tagline.replace(/\s*\|\s*/g, " · ")}</p>
        {site.offerwalls?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {site.offerwalls.slice(0, 4).map((w) => (
              <span key={w} className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{offerwallLabel(w)}</span>
            ))}
            {site.offerwalls.length > 4 && <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">+{site.offerwalls.length - 4}</span>}
          </div>
        )}
      </div>
      <div className="mt-auto flex items-center justify-between gap-4 pt-1">
        <RateMeter rates={site.rates} compact />
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
          {t("sites.visit")} <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
};

/* ---------------------------------------------------------------- GuideCard */
export const GuideCard = ({ guide, compact = false }) => {
  const { t, lang } = useLang();
  const dKey = difficultyKey(guide.difficulty);
  return (
    <Link
      to={`/Guides/${guide.slug}`}
      className="group card-surface flex flex-col overflow-hidden transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_18px_50px_-24px_var(--glow-strong)]"
      data-testid={`guide-card-${guide.slug}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface2">
        {guide.banner ? (
          <img src={guide.banner} alt={guide.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center grid-bg">
            <Layers className="h-10 w-10 text-brand-ink/70" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">{guide.category}</span>
          {guide.offerwalls.slice(0, 2).map((w) => (
            <span key={w} className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-semibold text-brand-fg">{w}</span>
          ))}
        </div>
        <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 font-mono text-sm font-bold text-white backdrop-blur">{guide.payout}</div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-bold leading-snug tracking-tight text-foreground line-clamp-2">{guide.title}</h3>
        <p className="mt-1.5 text-xs text-muted-foreground">{guide.platform} • {guide.genre}</p>
        {!compact && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{L(guide.summary, lang)}</p>}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {guide.duration}</span>
          <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", difficultyClass(guide.difficulty))}>{dKey ? t(`common.${dKey}`) : guide.difficulty}</span>
        </div>
      </div>
    </Link>
  );
};

/* ---------------------------------------------------------------- EventCard */
export const EventCard = ({ event, full = false }) => {
  const { t, lang } = useLang();
  const site = getSiteById(event.siteId);
  const urgent = event.remaining <= 25;
  const Icon = event.type === "boost" ? Zap : Trophy;
  return (
    <article className="card-surface flex flex-col p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-brand/50" data-testid={`event-card-${event.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {site && <SiteLogo src={site.logo} name={site.name} size={44} />}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{event.site}</p>
            <span className={cn("mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", event.type === "boost" ? "border-amber/30 bg-amber-soft text-amber" : "border-brand/30 bg-brand-soft text-brand-ink")}>
              <Icon className="h-3 w-3" /> {t(`events.${event.type}`)}
            </span>
          </div>
        </div>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold", urgent ? "bg-rose-soft text-rose" : "bg-mint-soft text-mint")}>
          {urgent ? <Flame className="h-3 w-3" /> : <span className="live-dot" />}
          {urgent ? t("events.lastChance") : t("events.activeBadge")}
        </span>
      </div>
      <h3 className="mt-5 font-display text-xl font-bold leading-snug tracking-tight">{event.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{L(event.description, lang)}</p>
      {full && (
        <ul className="mt-4 space-y-1.5">
          {L(event.bullets, lang).map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground/90"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{b}</li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-semibold text-foreground">{event.daysLeft} {t("events.daysLeft")}</span>
          <span className="text-muted-foreground">{event.remaining}% {t("events.remaining")}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className={cn("h-full rounded-full", urgent ? "bg-rose" : "bg-brand")} style={{ width: `${event.remaining}%` }} />
        </div>
      </div>
      {full && (
        <Button asChild className="mt-6 w-full font-semibold">
          <a href={event.url} target="_blank" rel="noreferrer nofollow">{t("events.open")} {event.site} <ExternalLink className="ml-1.5 h-4 w-4" /></a>
        </Button>
      )}
    </article>
  );
};

/* ------------------------------------------------------------------ FeedRow */
export const FeedRow = ({ item, fresh = false, compact = false }) => {
  const { t } = useLang();
  const big = item.amount >= 25;
  return (
    <div className={cn("flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors", fresh && "feed-fresh", !compact && "hover:border-border hover:bg-secondary/40")} data-testid="feed-row">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary font-display text-xs font-bold uppercase text-foreground">{item.user.slice(0, 2)}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">
          <span className="font-semibold text-foreground">@{item.user}</span>
          <span className="text-muted-foreground"> {t("feed.earned")} </span>
          <span className={cn("font-mono font-bold", big ? "text-brand-ink" : "text-mint")}>{fmtMoney(item.amount)}</span>
          {!compact && <span className="text-muted-foreground"> - {item.offer}</span>}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] uppercase">{item.wall}</span>
          <span className="mx-1.5">·</span>{item.source}
          {item.country && <><span className="mx-1.5">·</span><span className="font-mono text-[10px] uppercase">{item.country}</span></>}
        </p>
      </div>
      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{timeAgo(item.time, t)}</span>
    </div>
  );
};
