import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Trophy, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import { PageHeader, Reveal, SiteLogo } from "@/components/shared/Primitives";
import { EventCard } from "@/components/shared/Cards";
import { EVENTS, ENDED_EVENTS } from "@/data/content";
import { SITES } from "@/data/mock";
import { cn } from "@/lib/utils";

const findSite = (name) => SITES.find((s) => s.name.toLowerCase() === name.toLowerCase());

const Events = () => {
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const active = useMemo(() => EVENTS.filter((e) => !q || `${e.title} ${e.site}`.toLowerCase().includes(q)).sort((a, b) => a.daysLeft - b.daysLeft), [q]);
  const ended = useMemo(() => ENDED_EVENTS.filter((e) => !q || `${e.title} ${e.site}`.toLowerCase().includes(q)), [q]);

  return (
    <main data-testid="events-page">
      <PageHeader
        live
        eyebrow={<>{EVENTS.length} {t("events.active")}</>}
        title={t("events.title")}
        subtitle={t("events.subtitle")}
        aside={
          <div className="card-surface max-w-sm p-6" data-testid="events-plan-card">
            <p className="font-display text-lg font-bold">{t("events.planTitle")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("events.planSub")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="sm" className="font-semibold"><Link to="/Sites">{t("events.findRates")}</Link></Button>
              <Button asChild size="sm" variant="outline" className="font-semibold"><Link to="/Guides">{t("events.findGuide")}</Link></Button>
            </div>
          </div>
        }
      />

      <section className="container-x py-10 md:py-14">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("events.search")} className="h-11 bg-surface pl-9" data-testid="events-search" />
        </div>

        {active.length === 0 && ended.length === 0 && (
          <div className="card-surface mt-8 p-14 text-center text-muted-foreground" data-testid="events-empty">{t("events.noResults")}</div>
        )}

        {active.length > 0 && (
          <div className="mt-8 grid gap-5 lg:grid-cols-3" data-testid="events-active-grid">
            {active.map((e, i) => (
              <Reveal key={e.id} delay={i * 80}><EventCard event={e} full /></Reveal>
            ))}
          </div>
        )}

        {ended.length > 0 && (
          <Reveal className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-extrabold tracking-tight">{t("events.endedTitle")}</h2>
              <span className="font-mono text-xs text-muted-foreground">{ended.length}</span>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border" data-testid="events-ended-list">
              {ended.map((e, i) => {
                const site = findSite(e.site);
                const Icon = e.type === "boost" ? Zap : Trophy;
                return (
                  <div key={e.id || `${e.title}-${i}`} className={cn("flex items-center gap-4 bg-surface px-5 py-4 transition-colors hover:bg-secondary/40", i > 0 && "border-t border-border")}>
                    <SiteLogo src={site?.logo} name={e.site} size={36} rounded="rounded-lg" className="opacity-70 grayscale" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground/80">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.site}{e.dateRange ? ` · ${e.dateRange}` : ""}</p>
                    </div>
                    <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex"><Icon className="h-3.5 w-3.5" />{t(`events.${e.type}`)}</span>
                    <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{t("events.ended")}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        )}

        <Reveal className="mt-16 text-center">
          <Button asChild variant="outline" size="lg" className="gap-2 font-semibold">
            <Link to="/Sites">{t("events.findRates")} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </Reveal>
      </section>
    </main>
  );
};

export default Events;
