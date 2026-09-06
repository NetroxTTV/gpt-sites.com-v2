// Shared live-activity store. Polls the CashInStyle + SharkEarnings feeds
// (via our /api/feed proxy - CashInStyle has no CORS headers) and fans the
// merged stream out to every subscriber, so the hero ticker, home teaser and
// the Live Feed page share a single polling loop.
// Starts with mocked items so the UI is never empty, then swaps to real data.
import { seedFeed } from "@/data/content";
import { offerwallLabel } from "@/data/mock";

const POLL_MS = 60_000;
const MAX_ITEMS = 120;

const prettyWall = (key) => {
  const k = String(key || "").trim();
  if (!k) return "Offerwall";
  const label = offerwallLabel(k.toLowerCase());
  if (label !== k.toLowerCase()) return label;
  return k.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const mapCashInStyle = (data) =>
  (Array.isArray(data) ? data : [])
    .filter((e) => e && e.operation === "credit")
    .map((e) => ({
      id: `cis-${e.date}-${e.panelist?.uuid || "anon"}-${e.value}`,
      user: e.panelist?.username || "CIS user",
      offer: e.description || (e.is_survey ? "Survey" : "Offer"),
      wall: prettyWall(e.merchant),
      source: "CashInStyle",
      country: e.panelist?.country || "",
      amount: Number(e.value) || 0,
      time: Date.parse(e.date) || Date.now(),
    }));

const mapSharkEarnings = (data) =>
  (data?.events || []).map((e) => ({
    id: `shark-${e.id}`,
    user: e.is_private ? "Shark user" : e.username || "Shark user",
    // The Shark API exposes the partner wall but not the offer title.
    offer: e.type === "offer" ? `${e.partner} offer` : String(e.type || "Offer"),
    wall: String(e.partner || "Offerwall"),
    source: "SharkEarnings",
    country: e.country || "",
    amount: Number(e.amount) || 0,
    time: Date.parse(e.created_at) || Date.now(),
  }));

let state = { items: seedFeed(10), real: false, freshId: null };
const listeners = new Set();
let timer = null;
let inflight = false;

const emit = () => listeners.forEach((cb) => cb());

const fetchJson = async (url) => {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
};

async function poll() {
  if (inflight) return;
  inflight = true;
  try {
    const [cis, shark] = await Promise.allSettled([
      fetchJson("/api/feed/cashinstyle"),
      fetchJson("/api/feed/sharkearnings"),
    ]);
    const incoming = [
      ...(cis.status === "fulfilled" ? mapCashInStyle(cis.value) : []),
      ...(shark.status === "fulfilled" ? mapSharkEarnings(shark.value) : []),
    ];
    if (!incoming.length) return; // both failed - keep whatever we have

    const prevIds = new Set(state.real ? state.items.map((i) => i.id) : []);
    const merged = new Map();
    for (const item of [...incoming, ...(state.real ? state.items : [])]) {
      if (!merged.has(item.id)) merged.set(item.id, item);
    }
    const items = [...merged.values()].sort((a, b) => b.time - a.time).slice(0, MAX_ITEMS);
    const fresh = state.real ? items.find((i) => !prevIds.has(i.id)) : null;
    state = { items, real: true, freshId: fresh ? fresh.id : state.real ? state.freshId : null };
    emit();
  } finally {
    inflight = false;
  }
}

export const subscribeFeed = (cb) => {
  listeners.add(cb);
  if (!timer) {
    poll();
    timer = setInterval(poll, POLL_MS);
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
};

export const getFeedSnapshot = () => state;
