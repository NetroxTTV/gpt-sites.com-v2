import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/components/hooks/use-pagination";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { allOfferwalls, allSites } from "@/lib/sitesData";
import { AlertCircle, Clock3, Globe2, RefreshCw, Store, Wallet } from "lucide-react";

const FEEDS = [
  {
    key: "cashinstyle",
    name: "CashInStyle",
    url: "https://cashinstyle.com/api/activity-ticker.json",
    fallbackHref: "https://cashinstyle.com/?ref=NETROX",
  },
  {
    key: "sharkearnings",
    name: "SharkEarnings",
    url: "https://sharkearnings.com/api/activity.json?limit=100",
    fallbackHref: "https://sharkearnings.com/r/netrox",
  },
];

const REFRESH_MS = 30000;
const HOURS_WINDOW = 12;
const OFFERS_PER_PAGE = 25;
const CIS_LOGO = new URL("../imgs/Sites/cis.svg", import.meta.url).href;

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const rewardOptions = [
  { value: "all", label: "All rewards" },
  { value: "under-1", label: "Under $1" },
  { value: "1-5", label: "$1 - $5" },
  { value: "5-10", label: "$5 - $10" },
  { value: "10-25", label: "$10 - $25" },
  { value: "25-100", label: "$25 - $100" },
];

const wallOptions = ["all", ...allOfferwalls].map((wall) => ({
  value: wall,
  label: wall === "all" ? "All walls" : wall,
}));

const sourceCatalog = new Map(
  allSites.map((site) => [site.name.toLowerCase(), { name: site.name, href: site.visit_url, logo: site.logo_url }])
);

const sourceOptions = [
  { value: "all", label: "All sources" },
  ...FEEDS.map((feed) => {
    const site = sourceCatalog.get(feed.key) || {};

    return {
      value: feed.key,
      label: feed.name,
      logo: site.logo,
    };
  }),
];

const sourceFallbacks = new Map(
  FEEDS.map((feed) => [
    feed.key,
    {
      name: feed.name,
      href: feed.fallbackHref,
      logo: feed.key === "cashinstyle" ? CIS_LOGO : "https://www.google.com/s2/favicons?domain=sharkearnings.com&sz=128",
    },
  ])
);

const formatMoney = (value) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return value ?? "0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatAgo = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "just now";

  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const intervals = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  for (const [unit, unitSeconds] of intervals) {
    if (Math.abs(seconds) >= unitSeconds || unit === "minute") {
      return relativeTime.format(Math.round(seconds / unitSeconds), unit);
    }
  }

  return "just now";
};

const withinTwelveHours = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() <= HOURS_WINDOW * 60 * 60 * 1000;
};

const parseFeedPayload = (payload) => {
  const text = payload.trim();
  if (!text) return [];

  const candidates = text.startsWith("[") ? [text] : [text, `[${text.replace(/,\s*$/, "")}]`];

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed?.events)) return parsed.events;
      if (Array.isArray(parsed?.data)) return parsed.data;
      return parsed ? [parsed] : [];
    } catch {
      continue;
    }
  }

  return [];
};

const normalizeFeedItem = (sourceKey, item) => {
  if (!item) return null;

  if (sourceKey === "sharkearnings") {
    if (item.is_private) return null;

    return {
      source: sourceKey,
      date: item.created_at,
      value: item.amount,
      merchant: item.partner,
      description: `${item.partner || "SharkEarnings"} offer completion`,
      panelist: {
        username: item.username,
        country: item.country,
      },
    };
  }

  return {
    ...item,
    source: sourceKey,
    date: item.date,
    value: item.value,
    merchant: item.merchant,
    description: item.description || "Recent offer completion",
    panelist: item.panelist || {},
  };
};

const fetchFeedItems = async (feed, signal) => {
  const response = await fetch(feed.url, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Feed request failed with ${response.status}`);
  }

  const payload = await response.text();
  return parseFeedPayload(payload)
    .map((item) => normalizeFeedItem(feed.key, item))
    .filter((item) => item && withinTwelveHours(item.date));
};

const getRewardBand = (value) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return null;
  if (amount < 1) return "under-1";
  if (amount < 5) return "1-5";
  if (amount < 10) return "5-10";
  if (amount < 25) return "10-25";
  return "25-100";
};

const getRewardTone = (band) => {
  switch (band) {
    case "under-1":
      return "text-slate-300 border-slate-500/20 bg-slate-500/10";
    case "1-5":
      return "text-sky-300 border-sky-500/20 bg-sky-500/10";
    case "5-10":
      return "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";
    case "10-25":
      return "text-amber-300 border-amber-500/20 bg-amber-500/10";
    case "25-100":
      return "text-orange-300 border-orange-500/20 bg-orange-500/10";
    default:
      return "text-muted-foreground border-border/60 bg-background/70";
  }
};

function FilterBar({ label, icon: Icon, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/80 px-4 py-3 shadow-[0_8px_22px_rgba(15,23,42,0.08)]">
      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-border/60 bg-background/80 px-3 py-2.5 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function OfferRow({ item, index }) {
  const reduce = useReducedMotion();
  const band = getRewardBand(item?.value);
  const tone = getRewardTone(band);
  const timeAgo = formatAgo(item?.date);
  const countryCode = item?.panelist?.country;
  const countryLabel = countryCode ? countryNames.of(countryCode) ?? countryCode : "Global";
  const username = item?.panelist?.username || "CashInStyle panelist";
  const wall = item?.merchant || "Unknown wall";
  const sourceKey = item?.source || "cashinstyle";
  const source = sourceCatalog.get(sourceKey) ?? sourceFallbacks.get(sourceKey) ?? {
    name: "CashInStyle",
    href: "https://cashinstyle.com/?ref=NETROX",
    logo: CIS_LOGO,
  };

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, delay: index * 0.025, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-[0_10px_24px_rgba(15,23,42,0.10)] overflow-hidden"
    >
      <div className="space-y-2.5 p-3 sm:p-3.5">
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex items-start gap-3 min-w-0">
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-10 w-10 rounded-lg border border-border/70 bg-background/80 p-1.5 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.18),0_8px_18px_rgba(59,130,246,0.14)]"
              aria-label={`Open ${source.name}`}
            >
              <img
                src={source.logo}
                alt={source.name}
                className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-110"
                loading="lazy"
              />
            </a>
            <div className="min-w-0 pt-0.5">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
                >
                  <Store className="h-3.5 w-3.5" />
                  {source.name}
                </a>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {timeAgo}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-foreground leading-tight break-words">
                {item?.description || "Recent offer completion"}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                {username} · {countryLabel} · Offer
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 pt-0.5">
            <div className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs sm:text-sm font-black tracking-tight ${tone}`}>
              {formatMoney(item?.value)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 font-medium text-muted-foreground">
            <Globe2 className="h-3 w-3 text-primary" />
            {wall}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-none border border-dashed border-border/60 bg-card/40 p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
        <RefreshCw className="h-5 w-5 animate-spin text-primary" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export default function LiveFeed() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [wallFilter, setWallFilter] = useState("all");
  const [rewardFilter, setRewardFilter] = useState("all");
  const [query, setQuery] = useState("");
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadFeed = async () => {
      setStatus((current) => (current === "ready" ? "refreshing" : "loading"));
      setError("");

      try {
        const settledFeeds = await Promise.allSettled(FEEDS.map((feed) => fetchFeedItems(feed, controller.signal)));
        if (cancelled) return;

        const list = settledFeeds
          .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setItems(list);
        setStatus("ready");
        setLastUpdated(new Date());
      } catch (fetchError) {
        if (cancelled || fetchError.name === "AbortError") return;
        setStatus("error");
        setError("Unable to load the live offer feed right now.");
      }
    };

    loadFeed();
    const intervalId = window.setInterval(loadFeed, REFRESH_MS);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return items.filter((item) => {
      const wall = (item?.merchant || "").toLowerCase();
      const description = (item?.description || "").toLowerCase();
      const username = (item?.panelist?.username || "").toLowerCase();
      const sourceName = (item?.source || "cashinstyle").toLowerCase();
      const rewardBand = getRewardBand(item?.value);

      const sourceMatch = sourceFilter === "all" || sourceFilter === sourceName;
      const wallMatch = wallFilter === "all" || wall === wallFilter;
      const rewardMatch = rewardFilter === "all" || rewardBand === rewardFilter;
      const queryMatch =
        !needle ||
        wall.includes(needle) ||
        description.includes(needle) ||
        username.includes(needle) ||
        sourceName.includes(needle);

      return sourceMatch && wallMatch && rewardMatch && queryMatch;
    });
  }, [items, query, rewardFilter, sourceFilter, wallFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / OFFERS_PER_PAGE));
  const visibleItems = useMemo(
    () => filteredItems.slice((currentPage - 1) * OFFERS_PER_PAGE, currentPage * OFFERS_PER_PAGE),
    [currentPage, filteredItems]
  );

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 5,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [query, rewardFilter, sourceFilter, wallFilter]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const summary = useMemo(() => {
    const latest = filteredItems[0] || items[0];
    const offers = filteredItems.length;
    const topReward = filteredItems.reduce((max, item) => Math.max(max, Number(item?.value) || 0), 0);
    const topWall = filteredItems.reduce((counts, item) => {
      const wall = item?.merchant || "unknown";
      counts[wall] = (counts[wall] || 0) + 1;
      return counts;
    }, {});
    const topWallName = Object.entries(topWall).sort((a, b) => b[1] - a[1])[0]?.[0] || "Any wall";

    return {
      latestAmount: latest ? formatMoney(latest.value) : "--",
      latestLabel: latest ? latest.description : "Awaiting offers",
      latestTime: latest ? formatAgo(latest.date) : "just now",
      offers,
      topReward: topReward ? formatMoney(topReward) : "--",
      topWallName,
    };
  }, [filteredItems, items]);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <motion.section
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_38%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.82))] p-6 sm:p-8 shadow-[0_18px_40px_rgba(2,6,23,0.22)] mb-8"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.03)_45%,transparent_100%)] pointer-events-none" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary mb-4">
                  <Wallet className="h-3.5 w-3.5" />
                  Live offers
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight max-w-3xl">
                  Recent offers from GPT sites.
                </h1>
                <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-7">
                  Browse offer completions instead of cashouts, narrow by wall or reward size, and keep the source badge visible so multi-site feeds can slot in later.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">

                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Visible offers</p>
                  <div className="mt-2 text-2xl font-black text-white">{summary.offers}</div>
                  <p className="mt-1 text-sm text-slate-300">Last {HOURS_WINDOW}h</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Top reward</p>
                  <div className="mt-2 text-2xl font-black text-white">{summary.topReward}</div>
                  <p className="mt-1 text-sm text-slate-300">Highest filtered payout</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Most common wall</p>
                  <div className="mt-2 text-2xl font-black text-white truncate">{summary.topWallName}</div>
                  <p className="mt-1 text-sm text-slate-300">Across the current filter set</p>
                </div>
              </div>
            </div>
          </motion.section>

          <section className="mx-auto mb-6 grid max-w-4xl gap-3 lg:grid-cols-2 xl:grid-cols-3">
            <FilterBar label="Source" icon={Store} value={sourceFilter} onChange={setSourceFilter} options={sourceOptions} />
            <FilterBar label="Wall" icon={Globe2} value={wallFilter} onChange={setWallFilter} options={wallOptions} />
            <FilterBar label="Reward" icon={Wallet} value={rewardFilter} onChange={setRewardFilter} options={rewardOptions} />
          </section>

          <section className="mx-auto mb-6 max-w-4xl rounded-2xl border border-border/60 bg-card/70 p-3 sm:p-4 shadow-[0_12px_28px_rgba(15,23,42,0.10)]">
            <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="live-feed-search">
              Search offers
            </label>
            <input
              id="live-feed-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by wall or offer name"
              className="w-full rounded-2xl border border-border/60 bg-background/75 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
            />
          </section>

          {status === "error" && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mx-auto mb-5 flex max-w-4xl flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">Offer stream</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Showing only credits from the last {HOURS_WINDOW} hours. Withdrawals are hidden.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(34,197,94,0.15)]" />
              Live connection {status === "refreshing" ? "refreshing" : status === "ready" ? "active" : "starting"}
              {lastUpdated && <span className="text-muted-foreground/70">· {lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>}
            </div>
          </div>

          {visibleItems.length > 0 ? (
            <div className="mx-auto max-w-4xl space-y-4">
              {visibleItems.map((item, index) => (
                <OfferRow key={`${item?.date ?? "item"}-${index}`} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              <EmptyState
                title={items.length === 0 ? "Loading live offers" : "No offers match the current filters"}
                text={items.length === 0 ? "Pulling the latest 12-hour offer activity now." : "Try a different wall, reward band, or search term."}
              />
            </div>
          )}

          {filteredItems.length > OFFERS_PER_PAGE && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                  >
                    ←
                  </Button>
                </PaginationItem>

                {showLeftEllipsis && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => {
                          setCurrentPage(1);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  </>
                )}

                {pages.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {showRightEllipsis && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => {
                          setCurrentPage(totalPages);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                  >
                    →
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-border/60 bg-card/40 px-4 py-3 text-xs text-muted-foreground">
            Source note: this page now combines CashInStyle and SharkEarnings activity, and the row layout, filters, and source badge are set up so more sites can be added without changing the UI.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
