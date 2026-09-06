import React, { useMemo, useState } from "react";
import { Activity, Info, Layers, Pause, Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/i18n/LanguageContext";
import { PageHeader } from "@/components/shared/Primitives";
import { FeedRow } from "@/components/shared/Cards";
import { SearchField } from "@/components/sites/SitesToolbar";
import { FEED_SOURCES } from "@/data/content";
import { useLiveFeed, useFeedWalls, filterFeed, feedStats, REWARD_RANGES } from "@/hooks/useLiveFeed";
import { fmtMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="card-surface flex items-start gap-4 p-5">
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-ink"><Icon className="h-5 w-5" /></span>
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-display text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  </div>
);

const FeedFilters = ({ filters, setFilters, walls, paused, onTogglePaused }) => {
  const { t } = useLang();
  const update = (key) => (value) => setFilters((prev) => ({ ...prev, [key]: value }));
  return (
    <div className="card-surface mt-6 flex flex-col gap-3 p-4 lg:flex-row lg:items-center" data-testid="feed-filters">
      <Select value={filters.source} onValueChange={update("source")}>
        <SelectTrigger className="h-10 bg-background lg:w-44" data-testid="feed-filter-source"><SelectValue placeholder={t("feed.source")} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("feed.allSources")}</SelectItem>
          {FEED_SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.wall} onValueChange={update("wall")}>
        <SelectTrigger className="h-10 bg-background lg:w-44" data-testid="feed-filter-wall"><SelectValue placeholder={t("feed.wall")} /></SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value="all">{t("feed.allWalls")}</SelectItem>
          {walls.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.reward} onValueChange={update("reward")}>
        <SelectTrigger className="h-10 bg-background lg:w-44" data-testid="feed-filter-reward"><SelectValue placeholder={t("feed.reward")} /></SelectTrigger>
        <SelectContent>
          {Object.keys(REWARD_RANGES).map((k) => <SelectItem key={k} value={k}>{k === "all" ? t("feed.allRewards") : t(`feed.${k}`)}</SelectItem>)}
        </SelectContent>
      </Select>
      <SearchField value={filters.query} onChange={update("query")} placeholder={t("feed.search")} testId="feed-search" className="flex-1" />
      <Button variant={paused ? "default" : "outline"} onClick={onTogglePaused} className="h-10 gap-2 font-semibold" data-testid="feed-pause-toggle">
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        {paused ? t("feed.resume") : t("feed.pause")}
      </Button>
    </div>
  );
};

const FeedStream = ({ items, freshId, paused }) => {
  const { t } = useLang();
  return (
    <div className="card-surface mt-6 overflow-hidden" data-testid="feed-stream">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="font-display text-lg font-bold">{t("feed.stream")}</h2>
          <p className="text-xs text-muted-foreground">{t("feed.streamSub")}</p>
        </div>
        <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider", paused ? "bg-secondary text-muted-foreground" : "bg-mint-soft text-mint")} data-testid="feed-status">
          {!paused && <span className="live-dot" />}
          {paused ? t("feed.paused") : t("feed.live")}
        </span>
      </div>
      <div className="p-2 sm:p-3">
        {items.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground" data-testid="feed-empty">{t("feed.noResults")}</p>
        ) : (
          <div className="space-y-0.5">{items.map((it) => <FeedRow key={it.id} item={it} fresh={it.id === freshId} />)}</div>
        )}
      </div>
    </div>
  );
};

const INITIAL_FILTERS = { source: "all", wall: "all", reward: "all", query: "" };

const LiveFeed = () => {
  const { t } = useLang();
  const { items, freshId, paused, togglePaused } = useLiveFeed();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const walls = useFeedWalls(items);

  const filtered = useMemo(() => filterFeed(items, filters), [items, filters]);
  const { top, commonWall } = useMemo(() => feedStats(filtered), [filtered]);

  return (
    <main data-testid="live-feed-page">
      <PageHeader
        live
        eyebrow={t("feed.label")}
        title={t("feed.title")}
        subtitle={t("feed.subtitle")}
        aside={
          <div className="flex max-w-sm items-start gap-3 rounded-2xl border border-mint/30 bg-mint-soft p-4 text-sm text-foreground/90" data-testid="feed-live-notice">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
            <p>{t("feed.mocked")}</p>
          </div>
        }
      />

      <section className="container-x py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-3" data-testid="feed-stats">
          <StatCard icon={Activity} label={t("feed.visible")} value={filtered.length} sub={t("feed.last12h")} />
          <StatCard icon={Trophy} label={t("feed.topReward")} value={top ? fmtMoney(top) : "--"} sub={t("feed.highestFiltered")} />
          <StatCard icon={Layers} label={t("feed.commonWall")} value={commonWall || t("feed.anyWall")} sub={t("feed.acrossFilter")} />
        </div>
        <FeedFilters filters={filters} setFilters={setFilters} walls={walls} paused={paused} onTogglePaused={togglePaused} />
        <FeedStream items={filtered} freshId={freshId} paused={paused} />
      </section>
    </main>
  );
};

export default LiveFeed;
