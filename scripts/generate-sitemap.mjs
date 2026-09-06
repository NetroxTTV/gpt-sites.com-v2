/**
 * generate-sitemap.mjs
 *
 * Builds public/sitemap.xml from the static routes + every guide slug.
 * Runs automatically before each Vite build (see package.json "build").
 *
 * Edit SITE_URL or STATIC_ROUTES here when routes change.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { guides } from "../src/lib/guidesData.js";

const SITE_URL = "https://gpt-sites.com";

// path, changefreq, priority
const STATIC_ROUTES = [
  ["/", "daily", "1.0"],
  ["/Sites", "daily", "0.9"],
  ["/Guides", "weekly", "0.9"],
  ["/Tips", "weekly", "0.7"],
  ["/Events", "daily", "0.8"],
  ["/LiveFeed", "hourly", "0.6"],
  ["/Faq", "weekly", "0.6"],
];

const today = new Date().toISOString().slice(0, 10);

const urlEntry = (loc, changefreq, priority) =>
  `  <url>\n` +
  `    <loc>${SITE_URL}${loc}</loc>\n` +
  `    <lastmod>${today}</lastmod>\n` +
  `    <changefreq>${changefreq}</changefreq>\n` +
  `    <priority>${priority}</priority>\n` +
  `  </url>`;

const staticEntries = STATIC_ROUTES.map(([loc, cf, pr]) => urlEntry(loc, cf, pr));

const guideEntries = guides
  .filter((g) => g && g.slug)
  .map((g) => urlEntry(`/Guides/${g.slug}`, "monthly", "0.7"));

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [...staticEntries, ...guideEntries].join("\n") +
  `\n</urlset>\n`;

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), "../public");

const outPath = resolve(publicDir, "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log(`sitemap.xml written: ${staticEntries.length + guideEntries.length} URLs -> ${outPath}`);

// Per-guide meta, consumed by server.cjs to inject SEO tags into raw HTML
// for crawlers/social scrapers that do not execute JavaScript.
const guidesMeta = {};
for (const g of guides) {
  if (!g || !g.slug) continue;
  const bits = [g.platform, g.genre || g.category, g.offerwall && `${g.offerwall} offerwall`, g.totalReward && `earn ${g.totalReward}`]
    .filter(Boolean)
    .join(" • ");
  guidesMeta[g.slug] = {
    title: `${g.title} Guide | GPT Sites`,
    description: `${g.title} step-by-step earning guide${bits ? ` — ${bits}.` : "."} Setup, milestones, and tips to complete offers efficiently.`.slice(0, 300),
  };
}
const metaPath = resolve(publicDir, "guides-meta.json");
writeFileSync(metaPath, JSON.stringify(guidesMeta, null, 0), "utf8");
console.log(`guides-meta.json written: ${Object.keys(guidesMeta).length} guides -> ${metaPath}`);
