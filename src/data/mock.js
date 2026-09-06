// ---------------------------------------------------------------------------
// Site catalogue adapters. Source of truth: ./sitesData.js (owner's data file).
// This module shapes that data for the UI (ids, tags, rate ranges, ranks).
// ---------------------------------------------------------------------------
import { featuredSites, allSites, allOfferwalls } from "@/lib/sitesData";

export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const parseRates = (text, fallback) => {
  const m = (text || "").match(/(\d+)(?:-(\d+))?%/);
  if (m) {
    const min = parseInt(m[1], 10);
    return { min, max: m[2] ? parseInt(m[2], 10) : min };
  }
  if (typeof fallback === "number") return { min: fallback, max: fallback };
  return null;
};

const tagFromBadge = (site) => {
  const b = site.badge || "";
  if (b.startsWith("top")) return "top";
  if (b === "mobile_app") return "mobile";
  if (b === "new" || b === "popular") return b;
  if ((site.bonus_tag || "").toLowerCase() === "casino") return "casino";
  return "";
};

export const OFFERWALL_LABELS = {
  adgate: "AdGate", adscend: "Adscend Media", adtowall: "AdToWall", ayetstudios: "Ayet Studios", bitlabs: "BitLabs",
  gemiad: "Gemia", hangmyads: "Hang My Ads", inbrain: "inBrain", lootably: "Lootably", mmwall: "MM Wall", monlix: "Monlix",
  myChips: "myChips", notik: "Notik", primeearn: "Prime Earn", pixylabs: "PixyLabs", revu: "RevU", timewall: "Timewall",
  torox: "Torox", waxrewards: "WaxRewards",
};

export const OFFERWALL_KEYS = allOfferwalls;
export const OFFERWALLS = allOfferwalls.map((k) => OFFERWALL_LABELS[k] || k);
export const offerwallLabel = (key) => OFFERWALL_LABELS[key] || key;

// De-duplicate by name (the source list repeats EarnX once).
const seen = new Set();
export const SITES = allSites
  .filter((s) => {
    const k = s.name.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  })
  .map((s, i) => {
    const tag = tagFromBadge(s);
    const rank = tag === "top" ? parseInt(s.badge.replace("top", ""), 10) : null;
    const bonus = tag === "casino" ? "" : s.bonus_tag || "";
    return {
      id: slugify(s.name),
      name: s.name,
      tagline: s.description,
      logo: s.logo_url || null,
      url: s.visit_url,
      tag,
      bonus,
      rank,
      rating: s.rating ?? null,
      rateScore: typeof s.rates === "number" ? s.rates : null,
      rates: parseRates(s.description, s.rates),
      offerwalls: s.offerwalls || [],
      order: i,
    };
  });

export const TAG_LABELS = { top: "Top", new: "New", popular: "Popular", mobile: "Mobile App", casino: "Casino" };

export const getSiteById = (id) => SITES.find((s) => s.id === id);
export const getSiteByName = (name) => SITES.find((s) => s.name.toLowerCase() === (name || "").toLowerCase());

// Reward methods used on featured cards
export const REWARD_COLORS = {
  PayPal: "#0EA5E9", Bitcoin: "#F59E0B", Litecoin: "#94A3B8", "Gift Cards": "#34D399", Amazon: "#FB923C", Gamdom: "#22C55E", Roobet: "#A855F7",
};

export const getFeaturedSites = () =>
  [...featuredSites]
    .sort((a, b) => a.rank - b.rank)
    .map((f) => {
      const base = getSiteByName(f.name) || {};
      return {
        ...base,
        id: base.id || slugify(f.name),
        name: f.name,
        logo: f.logo_url || base.logo,
        url: f.visit_url,
        headline: f.tagline,
        bonus: f.bonus_tag || base.bonus || "",
        bonusNote: f.bonus || "",
        rewards: f.rewards || [],
        features: f.features || [],
        timeToPay: f.details?.pay_time,
        minWithdraw: f.details?.min_withdraw,
        minAge: f.details?.min_age,
        rating: f.rating ?? base.rating ?? 5,
        rates: base.rates || parseRates(f.tagline),
        featuredRank: f.rank,
      };
    });

export const DISCORD_URL = "https://discord.gg/gptfr";

export const STATS = {
  sites: SITES.length,
  offerwalls: allOfferwalls.length,
  discord: DISCORD_URL,
  youtube: "https://www.youtube.com/@netroxtv",
};
