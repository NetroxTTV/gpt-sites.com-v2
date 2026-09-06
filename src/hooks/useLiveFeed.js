import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { subscribeFeed, getFeedSnapshot } from "@/lib/liveFeedStore";

/**
 * Live activity stream shared across the app (see src/lib/liveFeedStore.js).
 * Real data from CashInStyle + SharkEarnings, polled every minute.
 * `paused` freezes the visible snapshot without stopping the background poll.
 */
export const useLiveFeed = () => {
  const live = useSyncExternalStore(subscribeFeed, getFeedSnapshot);
  const [frozen, setFrozen] = useState(null);

  const togglePaused = useCallback(() => setFrozen((f) => (f ? null : getFeedSnapshot())), []);

  const view = frozen ?? live;
  return { items: view.items, freshId: view.freshId, real: view.real, paused: Boolean(frozen), togglePaused };
};

/** Lightweight variant for the hero ticker / home teaser (no pause control). */
export const useFeedItems = () => {
  const live = useSyncExternalStore(subscribeFeed, getFeedSnapshot);
  return live;
};

/** Unique wall names present in the stream, for the filter dropdown. */
export const useFeedWalls = (items) =>
  useMemo(() => [...new Set(items.map((i) => i.wall))].sort((a, b) => a.localeCompare(b)), [items]);

export const REWARD_RANGES = {
  all: [0, Infinity],
  under1: [0, 1],
  r1_5: [1, 5],
  r5_10: [5, 10],
  r10_25: [10, 25],
  r25_100: [25, Infinity],
};

const TWELVE_HOURS = 12 * 3600 * 1000;

export const filterFeed = (items, { source, wall, reward, query }) => {
  const q = query.trim().toLowerCase();
  const [lo, hi] = REWARD_RANGES[reward] || REWARD_RANGES.all;
  const cutoff = Date.now() - TWELVE_HOURS;
  return items.filter((it) => {
    if (it.time < cutoff) return false;
    if (source !== "all" && it.source !== source) return false;
    if (wall !== "all" && it.wall !== wall) return false;
    if (it.amount < lo || it.amount >= hi) return false;
    if (q && !`${it.offer} ${it.user} ${it.wall}`.toLowerCase().includes(q)) return false;
    return true;
  });
};

export const feedStats = (items) => {
  let top = 0;
  const counts = {};
  for (const it of items) {
    if (it.amount > top) top = it.amount;
    counts[it.wall] = (counts[it.wall] || 0) + 1;
  }
  let commonWall = null;
  let best = 0;
  for (const [wall, n] of Object.entries(counts)) {
    if (n > best) {
      best = n;
      commonWall = wall;
    }
  }
  return { top, commonWall };
};
