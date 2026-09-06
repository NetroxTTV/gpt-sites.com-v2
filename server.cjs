const express = require("express");
const path = require("node:path");
const fs = require("node:fs");

const app = express();
const port = Number(process.env.PORT) || 4000;
const host = "0.0.0.0";
const distDir = path.resolve(__dirname, "dist");
const indexPath = path.join(distDir, "index.html");

const pick = (obj, keys, fallback = undefined) => {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return fallback;
};

const FX_TO_USD = {
  USD: 1,
  EUR: 1.09,
  GBP: 1.27,
  CAD: 0.74,
  AUD: 0.66,
  NZD: 0.61,
  CHF: 1.12,
  JPY: 0.0067,
};

const parseLocalizedAmount = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  let str = String(value ?? "").trim();
  if (!str) return 0;

  str = str.replace(/\s+/g, "").replace(/[^0-9,.-]/g, "");
  if (!str) return 0;

  const commaCount = (str.match(/,/g) || []).length;
  const dotCount = (str.match(/\./g) || []).length;

  if (commaCount > 0 && dotCount > 0) {
    if (str.lastIndexOf(",") > str.lastIndexOf(".")) {
      str = str.replace(/\./g, "").replace(",", ".");
    } else {
      str = str.replace(/,/g, "");
    }
  } else if (commaCount > 0) {
    const lastComma = str.lastIndexOf(",");
    const decimals = str.length - lastComma - 1;
    if (decimals <= 2) {
      str = str.replace(",", ".");
    } else {
      str = str.replace(/,/g, "");
    }
  } else if (dotCount > 1) {
    const lastDot = str.lastIndexOf(".");
    str = str.slice(0, lastDot).replace(/\./g, "") + "." + str.slice(lastDot + 1);
  }

  const parsed = Number(str);
  return Number.isFinite(parsed) ? parsed : 0;
};

const inferCurrencyCode = (raw, payoutValue) => {
  const explicit = String(
    pick(raw, ["payout_currency", "currency", "currency_code", "currencyCode", "currency_id"], "")
  ).toUpperCase();
  if (explicit && FX_TO_USD[explicit]) {
    return explicit;
  }

  const payoutStr = String(payoutValue ?? "");
  if (payoutStr.includes("€")) return "EUR";
  if (payoutStr.includes("£")) return "GBP";
  if (payoutStr.includes("¥")) return "JPY";

  return "USD";
};

const getDefaultPayoutEntry = (raw) => {
  const entries = raw?.relationship?.payouts?.entries;
  if (!Array.isArray(entries) || entries.length === 0) return null;
  const defaultEntry = entries.find((entry) => entry && entry.is_default === true);
  return defaultEntry || entries[0] || null;
};

const getRelationshipCountries = (raw) => {
  const ruleset = raw?.relationship?.ruleset;
  if (ruleset && Array.isArray(ruleset.countries)) {
    return ruleset.countries;
  }
  return null;
};

const normalizeCountry = (country) => ({
  country_code: String(pick(country, ["country_code", "code", "countryCode"], "")).toUpperCase(),
  label: pick(country, ["label", "name", "country_name", "countryName"], "Unknown"),
  targeting_type: pick(country, ["targeting_type", "targetingType"], "include"),
});

const getOfferId = (raw, idx = 0) =>
  String(pick(raw, ["id", "offer_id", "offerId", "network_offer_id"], `offer-${idx + 1}`));

const hasPositivePayout = (raw) => {
  const payoutEntry = getDefaultPayoutEntry(raw);
  const payoutValue = pick(
    raw,
    ["payout", "payout_formatted", "payout_amount", "revenue", "revenue_amount"],
    pick(payoutEntry, ["payout_amount", "revenue_amount", "payout_percentage"], 0)
  );
  return parseLocalizedAmount(payoutValue) > 0;
};

const enrichOfferPayoutsWithDetails = async ({ offerList, headers, origin }) => {
  if (!Array.isArray(offerList) || offerList.length === 0) return offerList;

  const MAX_ENRICHMENT = 30;
  const toEnrich = [];

  for (let i = 0; i < offerList.length; i += 1) {
    const offer = offerList[i];
    if (hasPositivePayout(offer)) continue;

    const offerId = pick(offer, ["network_offer_id", "id", "offer_id", "offerId"], null);
    if (!offerId) continue;

    toEnrich.push({ idx: i, offerId: String(offerId) });
    if (toEnrich.length >= MAX_ENRICHMENT) break;
  }

  if (toEnrich.length === 0) return offerList;

  const enriched = [...offerList];
  const detailResponses = await Promise.allSettled(
    toEnrich.map(async ({ idx, offerId }) => {
      const detailUrl = `${origin}/v1/affiliates/offers/${offerId}`;
      const response = await fetch(detailUrl, { method: "GET", headers });
      if (!response.ok) return { idx, detail: null };

      const text = await response.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        return { idx, detail: null };
      }

      const detail = pick(parsed, ["offer", "data"], parsed);
      if (!detail || typeof detail !== "object") return { idx, detail: null };
      return { idx, detail };
    })
  );

  for (const response of detailResponses) {
    if (response.status !== "fulfilled") continue;
    const { idx, detail } = response.value;
    if (!detail) continue;

    const current = enriched[idx] || {};
    enriched[idx] = {
      ...current,
      ...detail,
      relationship: {
        ...(current.relationship || {}),
        ...(detail.relationship || {}),
      },
    };
  }

  return enriched;
};

const normalizeOffer = (raw, idx) => {
  const payoutEntry = getDefaultPayoutEntry(raw);
  const payoutValue = pick(
    raw,
    [
      "payout",
      "payout_formatted",
      "payout_amount",
      "revenue",
      "revenue_amount",
    ],
    pick(payoutEntry, ["payout_amount", "revenue_amount", "payout_percentage"], 0)
  );
  const payoutCurrencyFromEntry = pick(payoutEntry, ["currency", "currency_code", "currencyCode"], "");
  const rawWithEntryCurrency = payoutCurrencyFromEntry
    ? { ...raw, currency: payoutCurrencyFromEntry }
    : raw;
  const payoutLocal = parseLocalizedAmount(payoutValue);
  const payoutCurrency = inferCurrencyCode(rawWithEntryCurrency, payoutValue);
  const fx = FX_TO_USD[payoutCurrency] || 1;
  const payout = Number((payoutLocal * fx).toFixed(2));
  const rawCountries = getRelationshipCountries(raw)
    || pick(raw, ["countries", "country_targeting", "targeting_countries"], []);

  return {
    id: getOfferId(raw, idx),
    name: String(pick(raw, ["name", "title"], "Offer")),
    category: String(pick(raw, ["category", "category_name", "vertical"], raw?.relationship?.category?.name || "Other")),
    payout,
    payout_original: payoutLocal,
    payout_currency: payoutCurrency,
    status: String(pick(raw, ["status", "offer_status"], "active")).toLowerCase(),
    time_created: Number(pick(raw, ["time_created", "created_at", "createdAt"], Date.now() / 1000)),
    thumbnail_url: pick(raw, ["thumbnail_url", "image_url", "preview_url", "icon_url"], null),
    description: pick(raw, ["description", "short_description", "html_description"], ""),
    tracking_url: pick(raw, ["tracking_url", "url", "preview_url", "offer_url"], null),
    countries: Array.isArray(rawCountries) ? rawCountries.map(normalizeCountry) : [],
  };
};

const applyNormalizedFilters = (offers, { search, country, category }) => {
  const searchTerm = String(search || "").trim().toLowerCase();
  const countryCode = String(country || "").trim().toUpperCase();
  const categoryValue = String(category || "").trim();

  return offers.filter((offer) => {
    if (searchTerm) {
      const haystack = `${offer.name || ""} ${offer.category || ""}`.toLowerCase();
      if (!haystack.includes(searchTerm)) return false;
    }

    if (countryCode && countryCode !== "ALL") {
      const hasCountry = (offer.countries || []).some(
        (c) => c && c.targeting_type === "include" && String(c.country_code || "").toUpperCase() === countryCode
      );
      if (!hasCountry) return false;
    }

    if (categoryValue && categoryValue !== "All") {
      if (String(offer.category || "") !== categoryValue) return false;
    }

    return true;
  });
};

const fetchAndParseOffersPage = async ({ url, headers }) => {
  const response = await fetch(url, { method: "GET", headers });
  const text = await response.text();

  if (!response.ok) {
    let remoteMessage = "";
    try {
      const parsedError = JSON.parse(text);
      remoteMessage = pick(parsedError, ["error", "message", "detail"], "") || "";
    } catch {
      remoteMessage = text.slice(0, 180).replace(/\s+/g, " ").trim();
    }
    throw new Error(`Partner API error ${response.status} on ${url.origin}${remoteMessage ? `: ${remoteMessage}` : ""}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response from ${url.origin}`);
  }

  const offerList = Array.isArray(parsed) ? parsed : pick(parsed, ["offers", "data", "results"], []);
  if (!Array.isArray(offerList)) {
    throw new Error(`Unexpected payload shape from ${url.origin}`);
  }

  const paging = pick(parsed, ["paging", "pagination", "meta"], {});
  const totalCount = Number(pick(paging, ["total_count", "total", "count"], offerList.length)) || offerList.length;

  return { offerList, totalCount };
};

async function fetchWallOffers(wallKey, { page, pageSize, search, country, category }) {
  const cfg = WALL_CONFIG[wallKey];
  if (!cfg) {
    return { status: 400, body: { error: `Unsupported wall '${wallKey}'` } };
  }

  if (!cfg.apiKey) {
    return { status: 500, body: { error: `Missing API key for wall '${wallKey}'` } };
  }

  const headers = {
    "Accept": "application/json",
    "X-Eflow-API-Key": cfg.apiKey,
  };

  const hasGlobalFilters = Boolean(
    String(search || "").trim()
      || (String(country || "").trim() && String(country || "").trim().toUpperCase() !== "ALL")
      || (String(category || "").trim() && String(category || "").trim() !== "All")
  );

  let lastError = "Unable to reach partner API";
  for (const baseUrl of cfg.candidateUrls) {
    try {
      if (!hasGlobalFilters) {
        const url = new URL(baseUrl);
        url.searchParams.set("page", String(page));
        url.searchParams.set("page_size", String(pageSize));

        const { offerList, totalCount } = await fetchAndParseOffersPage({ url, headers });

        const offerListWithPayouts = await enrichOfferPayoutsWithDetails({
          offerList,
          headers,
          origin: url.origin,
        });

        return {
          status: 200,
          body: {
            wall: wallKey,
            data: {
              offers: offerListWithPayouts.map(normalizeOffer),
              paging: {
                total_count: totalCount,
                page,
                page_size: pageSize,
              },
            },
          },
        };
      }

      const MAX_SCAN_PAGES = 40;
      const scanPageSize = 200;
      const scannedNormalized = [];
      let scanPage = 1;
      let remoteTotal = Infinity;
      let scanError = "";

      while (scanPage <= MAX_SCAN_PAGES && scannedNormalized.length < remoteTotal) {
        const scanUrl = new URL(baseUrl);
        scanUrl.searchParams.set("page", String(scanPage));
        scanUrl.searchParams.set("page_size", String(scanPageSize));

        let offerList;
        let totalCount;
        try {
          const parsedPage = await fetchAndParseOffersPage({
            url: scanUrl,
            headers,
          });
          offerList = parsedPage.offerList;
          totalCount = parsedPage.totalCount;
        } catch (error) {
          scanError = error instanceof Error ? error.message : String(error);
          break;
        }

        remoteTotal = Number.isFinite(totalCount) ? totalCount : remoteTotal;
        if (offerList.length === 0) break;

        const offerListWithPayouts = await enrichOfferPayoutsWithDetails({
          offerList,
          headers,
          origin: scanUrl.origin,
        });
        scannedNormalized.push(...offerListWithPayouts.map(normalizeOffer));

        if (offerList.length < scanPageSize) break;
        scanPage += 1;
      }

      if (scannedNormalized.length === 0) {
        throw new Error(scanError || `Unable to fetch offers from ${baseUrl}`);
      }

      const filtered = applyNormalizedFilters(scannedNormalized, { search, country, category });
      const start = (page - 1) * pageSize;
      const paged = filtered.slice(start, start + pageSize);

      return {
        status: 200,
        body: {
          wall: wallKey,
          data: {
            offers: paged,
            paging: {
              total_count: filtered.length,
              page,
              page_size: pageSize,
            },
          },
        },
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }

  return { status: 502, body: { error: lastError } };
}

if (!fs.existsSync(indexPath)) {
  console.warn("dist/index.html was not found. Run 'npm run build' before 'npm start'.");
}

// --- SEO: inject per-route meta into raw HTML ---------------------------------
// Crawlers and social scrapers (Facebook, Discord, Twitter, WhatsApp, etc.) do
// not run our client JS, so the client-side <RouteMeta> never executes for them.
// We rewrite the title/description/og/canonical tags server-side per request so
// the raw HTML they receive already carries the correct, route-specific meta.
const SITE_URL = "https://gpt-sites.com";
const DEFAULT_META = {
  title: "GPT Sites",
  description: "Find top GPT sites, guides, and offers to earn smarter.",
};
// Keep in sync with routeMeta in src/App.jsx
const ROUTE_META = {
  "/": { title: "GPT Sites | Home", description: "Discover trusted GPT sites, compare rates, and find beginner-friendly ways to earn with offers, surveys, and rewards." },
  "/Home": { title: "GPT Sites | Home", description: "Discover trusted GPT sites, compare rates, and find beginner-friendly ways to earn with offers, surveys, and rewards." },
  "/Guides": { title: "GPT Sites | Guides", description: "Read practical GPT and offerwall guides with strategies, step-by-step tips, and payout-focused walkthroughs." },
  "/Tips": { title: "GPT Sites | Tips", description: "Learn smart earning tips to maximize rewards, avoid common mistakes, and improve completion rates on GPT sites." },
  "/Sites": { title: "GPT Sites | Sites", description: "Browse and filter GPT websites by offerwalls, popularity, and payout rates to find the best site for your goals." },
  "/Events": { title: "GPT Sites | Events", description: "Track offerwall boosts, tournaments, and seasonal promos across top GPT sites so you can earn at peak rates." },
  "/LiveFeed": { title: "GPT Sites | Live Feed", description: "Watch CashInStyle's live activity ticker for recent offer credits, survey completions, and withdrawals in real time." },
  "/Faq": { title: "GPT Sites | FAQ", description: "Get answers about GPT sites, offerwall tracking, payout speeds, safety, and how to earn more from offers and surveys." },
  "/Offers": { title: "GPT Sites | Offers", description: "Explore current offer opportunities and redirect to the latest events and boosts across top GPT sites." },
};

// Cloudflare (proxying gpt-sites.com) sets CF-IPCountry on every request for
// free - no external API, no extra request. We only special-case countries
// where French/Spanish/German is unambiguously the primary language; every
// other country (including multilingual ones like Belgium/Switzerland) falls
// through to the client's browser-language detection as before.
const COUNTRY_TO_LANG = {
  fr: ["FR", "CI", "SN", "ML", "BF", "NE", "TG", "CD", "CG", "GA", "MG", "HT", "MC", "GN", "BJ", "RE", "GP", "MQ", "GF", "PF", "NC"],
  es: ["ES", "MX", "AR", "CO", "PE", "VE", "CL", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "GQ"],
  de: ["DE", "AT", "LI"],
};
const LANG_BY_COUNTRY = Object.fromEntries(
  Object.entries(COUNTRY_TO_LANG).flatMap(([lang, countries]) => countries.map((c) => [c, lang]))
);
const langForCountry = (countryCode) => LANG_BY_COUNTRY[String(countryCode || "").toUpperCase()] || null;

let GUIDES_META = {};
try {
  GUIDES_META = JSON.parse(fs.readFileSync(path.join(distDir, "guides-meta.json"), "utf8"));
} catch {
  GUIDES_META = {};
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const metaForPath = (pathname) => {
  const guideMatch = /^\/Guides\/([^/]+)\/?$/.exec(pathname);
  if (guideMatch && GUIDES_META[guideMatch[1]]) return GUIDES_META[guideMatch[1]];
  return ROUTE_META[pathname] || DEFAULT_META;
};

let indexTemplate = null;
const readIndexTemplate = () => {
  if (indexTemplate == null) {
    try {
      indexTemplate = fs.readFileSync(indexPath, "utf8");
    } catch {
      indexTemplate = "";
    }
  }
  return indexTemplate;
};

const renderIndexHtml = (pathname, countryCode) => {
  let html = readIndexTemplate();
  if (!html) return html;

  const geoLang = langForCountry(countryCode);
  html = html.replace("<!--GEO_LANG-->", geoLang ? `<script>window.__GEO_LANG__="${geoLang}";</script>` : "");

  const { title, description } = metaForPath(pathname);
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(SITE_URL + pathname);

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${t}</title>`);

  const setMetaContent = (attrName, key, value) => {
    const tagRe = new RegExp(`<meta\\b[^>]*\\b${attrName}="${key}"[^>]*>`, "i");
    const match = html.match(tagRe);
    if (!match) return;
    let tag = match[0];
    tag = /content="[^"]*"/i.test(tag)
      ? tag.replace(/content="[^"]*"/i, `content="${value}"`)
      : tag.replace(/\s*\/?>$/, ` content="${value}" />`);
    html = html.replace(match[0], tag);
  };

  setMetaContent("name", "description", d);
  setMetaContent("property", "og:title", t);
  setMetaContent("property", "og:description", d);
  setMetaContent("property", "og:url", u);
  setMetaContent("name", "twitter:title", t);
  setMetaContent("name", "twitter:description", d);

  html = html.replace(/(<link\b[^>]*\brel="canonical"[^>]*\bhref=")[^"]*(")/i, `$1${u}$2`);

  return html;
};

app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

// Live activity feeds. CashInStyle sends no CORS headers, so the browser can't
// call it directly - both sources are proxied here with a short cache.
const FEED_UPSTREAMS = {
  cashinstyle: "https://cashinstyle.com/api/activity-ticker.json",
  sharkearnings: "https://sharkearnings.com/api/activity.json",
};
const FEED_CACHE_TTL_MS = 30_000;
const feedCache = new Map(); // source -> { at, status, body }

app.get("/api/feed/:source", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=30");

  const source = String(req.params.source || "").toLowerCase();
  const upstream = FEED_UPSTREAMS[source];
  if (!upstream) {
    res.status(400).json({ error: `Unknown feed source '${source}'` });
    return;
  }

  const cached = feedCache.get(source);
  if (cached && Date.now() - cached.at < FEED_CACHE_TTL_MS) {
    res.status(cached.status).json(cached.body);
    return;
  }

  try {
    const response = await fetch(upstream, { headers: { Accept: "application/json" } });
    const body = await response.json();
    if (response.ok) {
      feedCache.set(source, { at: Date.now(), status: response.status, body });
    }
    res.status(response.status).json(body);
  } catch {
    if (cached) {
      res.status(cached.status).json(cached.body);
      return;
    }
    res.status(502).json({ error: `Feed source '${source}' unreachable` });
  }
});

app.get("/api/offers/:wall", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Eflow-API-Key");

  const wall = String(req.params.wall || "").toLowerCase();
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(200, Math.max(1, Number(req.query.page_size) || 50));
  const search = String(req.query.search || "");
  const country = String(req.query.country || "");
  const category = String(req.query.category || "");

  const result = await fetchWallOffers(wall, { page, pageSize, search, country, category });
  res.status(result.status).json(result.body);
});

app.use(
  express.static(distDir, {
    index: false,
    maxAge: "1h",
    etag: true,
  })
);

app.get("/{*splat}", (req, res) => {
  const html = renderIndexHtml(req.path, req.headers["cf-ipcountry"]);
  if (!html) {
    res.sendFile(indexPath);
    return;
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
