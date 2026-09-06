// ---------------------------------------------------------------------------
// Content adapters. Sources of truth (owner's files):
//   ./eventsData.js  -> EVENTS / ENDED_EVENTS
//   ./guidesData.js  -> GUIDES
// Tips, FAQ and the (MOCKED) live feed generator live here as well.
// ---------------------------------------------------------------------------
import { events, getDaysLeft } from "@/lib/eventsData";
import { guides } from "@/lib/guidesData";
import { allOfferwalls } from "@/lib/sitesData";
import { slugify } from "./mock";

export const L = (obj, lang) => {
  if (obj == null) return "";
  if (typeof obj === "string" || Array.isArray(obj)) return obj;
  return obj[lang] ?? obj.en ?? "";
};

/* ------------------------------------------------------------------ EVENTS */
const now = Date.now();
const isBoost = (title) => /boost|\+\s?\d+\s?%/i.test(title);

const fmtDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const formatRange = (a, b) => (a && b ? `${fmtDate(a)} - ${fmtDate(b)}` : b ? `Ends ${fmtDate(b)}` : "");

export const ALL_EVENTS = events.map((e, i) => {
  const daysLeft = getDaysLeft(e.endDate);
  const start = new Date(`${e.startDate}T00:00:00`).getTime();
  const end = new Date(`${e.endDate}T23:59:59`).getTime();
  const span = Math.max(1, end - start);
  let remaining = 0;
  if (daysLeft !== null) {
    const pct = Math.round(((end - now) / span) * 100);
    remaining = Math.max(2, Math.min(100, pct));
  }
  return {
    id: `${slugify(e.title)}-${i}`,
    title: e.title,
    site: e.siteName,
    siteId: slugify(e.siteName),
    url: e.siteUrl,
    description: e.highlight,
    bullets: e.details || [],
    dateRange: formatRange(e.startDate, e.endDate),
    startDate: e.startDate,
    endDate: e.endDate,
    daysLeft,
    remaining,
    type: isBoost(e.title) ? "boost" : "tournament",
    status: daysLeft === null ? "ended" : "active",
  };
});

export const EVENTS = ALL_EVENTS.filter((e) => e.status === "active").sort((a, b) => a.daysLeft - b.daysLeft);
export const ENDED_EVENTS = ALL_EVENTS.filter((e) => e.status === "ended").sort((a, b) => (a.endDate < b.endDate ? 1 : -1));

/* ------------------------------------------------------------------ GUIDES */
const parsePayout = (text) => {
  const nums = (text || "").replace(/,/g, "").match(/\d+(\.\d+)?/g);
  if (!nums) return 0;
  return Math.max(...nums.map(Number));
};

const firstSummary = (sections) => {
  for (const s of sections || []) {
    for (const c of s.content || []) {
      if ((c.type === "callout" || c.type === "text") && c.text) return c.text;
    }
  }
  return "";
};

export const GUIDES = guides.map((g) => ({
  ...g,
  offerwalls: (g.offerwall || "").split(/\s*\/\s*/).map((w) => w.trim()).filter(Boolean),
  payout: g.totalReward,
  payoutValue: parsePayout(g.totalReward),
  duration: g.timeInvestment,
  summary: firstSummary(g.sections),
  money: g.moneyInvestment || g.moneyRequirement || null,
}));

export const GUIDE_CATEGORIES = Array.from(new Set(GUIDES.map((g) => g.category)));
export const DIFFICULTIES = ["Easy", "Medium", "Hard"];
export const getGuideBySlug = (slug) => GUIDES.find((g) => g.slug === slug);

/* -------------------------------------------------------------------- TIPS */
export const TIPS = [
  { icon: "Trophy", title: { en: "Start with high-paying sites", fr: "Commencez par les sites qui paient le plus", es: "Empieza por los sitios que más pagan", de: "Beginne mit den bestzahlenden Seiten" }, text: { en: "Focus on sites with 80%+ rates like Earnlab, CashInStyle and GemsLoot. They offer the best return for your time.", fr: "Concentrez-vous sur les sites avec 80%+ de taux comme Earnlab, CashInStyle et GemsLoot. Ils offrent le meilleur rendement pour votre temps.", es: "Céntrate en sitios con tasas de 80%+ como Earnlab, CashInStyle y GemsLoot.", de: "Konzentriere dich auf Seiten mit 80%+ Raten wie Earnlab, CashInStyle und GemsLoot." } },
  { icon: "Gamepad2", title: { en: "Game offers pay well", fr: "Les offres jeu paient bien", es: "Las ofertas de juegos pagan bien", de: "Spiele-Angebote zahlen gut" }, text: { en: "Mobile game offers often pay $5-$50+. Look for games that require reaching a specific level - they usually have the best payouts.", fr: "Les offres de jeux mobiles paient souvent 5 à 50 $+. Cherchez les jeux qui demandent d'atteindre un niveau précis : ce sont les mieux payés.", es: "Las ofertas de juegos móviles suelen pagar $5-$50+.", de: "Mobile-Game-Angebote zahlen oft $5-$50+." } },
  { icon: "Gift", title: { en: "Check for bonuses", fr: "Vérifiez les bonus", es: "Busca bonificaciones", de: "Achte auf Boni" }, text: { en: "Many sites offer holiday bonuses, streak rewards and seasonal promotions. Log in daily to maximise your earnings.", fr: "Beaucoup de sites proposent des bonus saisonniers et des récompenses de série. Connectez-vous chaque jour.", es: "Muchos sitios ofrecen bonos de temporada y recompensas por racha.", de: "Viele Seiten bieten Saison-Boni und Streak-Belohnungen." } },
  { icon: "Scale", title: { en: "Compare offerwalls", fr: "Comparez les offerwalls", es: "Compara los offerwalls", de: "Vergleiche Offerwalls" }, text: { en: "The same offer can pay differently on different sites. Use the Sites page to find which one pays the most.", fr: "La même offre peut payer différemment selon le site. Utilisez la page Sites pour trouver celui qui paie le plus.", es: "La misma oferta puede pagar distinto según el sitio.", de: "Dasselbe Angebot kann je nach Seite unterschiedlich zahlen." } },
  { icon: "BookOpen", title: { en: "Use guides first", fr: "Lisez les guides d'abord", es: "Usa las guías primero", de: "Lies zuerst die Guides" }, text: { en: "Check Guides before starting an offer so you avoid common mistakes and finish faster.", fr: "Consultez les Guides avant de démarrer une offre pour éviter les erreurs courantes et finir plus vite.", es: "Consulta las guías antes de empezar una oferta.", de: "Lies die Guides, bevor du ein Angebot startest." } },
  { icon: "Percent", title: { en: "Check rates before you start", fr: "Vérifiez les taux avant de commencer", es: "Revisa las tasas antes de empezar", de: "Prüfe die Raten vor dem Start" }, text: { en: "Use the Sites page to compare rates so you always pick the highest paying site.", fr: "Comparez les taux sur la page Sites pour toujours choisir le site le mieux payé.", es: "Compara tasas para elegir siempre el sitio que más paga.", de: "Vergleiche Raten, um immer die bestzahlende Seite zu wählen." } },
  { icon: "Mail", title: { en: "Use a dedicated email", fr: "Utilisez un e-mail dédié", es: "Usa un correo dedicado", de: "Nutze eine eigene E-Mail" }, text: { en: "Create a separate email for GPT sites to keep your inbox organised and never miss a reward notification.", fr: "Créez une adresse séparée pour les sites GPT afin de garder une boîte propre et ne rater aucune notification.", es: "Crea un correo separado para los sitios GPT.", de: "Erstelle eine separate E-Mail für GPT-Seiten." } },
  { icon: "ShieldOff", title: { en: "Avoid VPNs", fr: "Évitez les VPN", es: "Evita las VPN", de: "Vermeide VPNs" }, text: { en: "Most sites ban accounts using VPNs. Always complete offers from your real location to protect your earnings.", fr: "La plupart des sites bannissent les comptes utilisant un VPN. Complétez toujours les offres depuis votre vraie localisation.", es: "La mayoría de los sitios banean cuentas con VPN.", de: "Die meisten Seiten sperren Konten mit VPN." } },
  { icon: "Camera", title: { en: "Screenshot everything", fr: "Capturez tout", es: "Captura todo", de: "Screenshots von allem" }, text: { en: "Always take screenshots of completed offers. It makes support tickets for missing credits a formality.", fr: "Prenez toujours des captures des offres terminées. Les tickets pour crédits manquants deviennent une formalité.", es: "Haz capturas de las ofertas completadas.", de: "Mache immer Screenshots abgeschlossener Angebote." } },
  { icon: "Target", title: { en: "One offer at a time", fr: "Une offre à la fois", es: "Una oferta a la vez", de: "Ein Angebot nach dem anderen" }, text: { en: "Complete one offer fully before starting another. It avoids tracking confusion and ensures proper credit.", fr: "Terminez complètement une offre avant d'en commencer une autre. Cela évite les confusions de tracking.", es: "Completa una oferta antes de empezar otra.", de: "Schließe ein Angebot vollständig ab, bevor du ein neues startest." } },
  { icon: "Search", title: { en: "Check offers quickly", fr: "Vérifiez les offres rapidement", es: "Revisa ofertas rápidamente", de: "Angebote schnell prüfen" }, text: { en: "Want to scan every offer at once? Use gpthub.gg/offers to search across walls in seconds.", fr: "Pour scanner toutes les offres d'un coup, utilisez gpthub.gg/offers.", es: "Usa gpthub.gg/offers para buscar en todos los walls.", de: "Nutze gpthub.gg/offers, um alle Walls zu durchsuchen." }, link: "https://gpthub.gg/offers" },
];

/* --------------------------------------------------------------------- FAQ */
export const FAQ_CATEGORIES = ["start", "payments", "offers", "safety"];

export const FAQS = [
  { cat: "offers", q: { en: "Why didn't my offer credit?", fr: "Pourquoi mon offre n'a pas été créditée ?" }, a: { en: "Most missing credits come from one of three things: an ad-blocker or VPN interfering with tracking, the offer being opened on a different device/network than the one used to finish it, or a milestone that wasn't fully met (e.g. level 24 instead of 25). Wait the stated credit window, then open a ticket on the offerwall (not the GPT site) with screenshots of the completion.", fr: "Les crédits manquants viennent presque toujours d'un bloqueur de pub/VPN qui gêne le tracking, d'un changement d'appareil ou de réseau, ou d'un palier non atteint. Attendez le délai indiqué puis ouvrez un ticket sur l'offerwall avec vos captures." } },
  { cat: "offers", q: { en: "Which site pays the most for mobile game offers?", fr: "Quel site paie le plus pour les offres de jeux mobiles ?" }, a: { en: "Right now Earnlab (80-90%), GemsLoot (65-95%) and CashInStyle (90%) consistently top the charts. The right pick depends on the offerwall: Prime Earn games are usually best on Earnlab or GemsLoot, Torox games on Earnlab or Earnopolis. Check Events too - a +20% boost can flip the ranking.", fr: "Actuellement Earnlab (80-90%), GemsLoot (65-95%) et CashInStyle (90%) dominent. Le bon choix dépend de l'offerwall : Prime Earn sur Earnlab ou GemsLoot, Torox sur Earnlab ou Earnopolis. Regardez aussi les Events, un boost de +20% peut changer le classement." } },
  { cat: "start", q: { en: "What's a 'rate' and why does it matter?", fr: "Qu'est-ce qu'un « taux » et pourquoi est-ce important ?" }, a: { en: "The rate is the share of the advertiser payout that the GPT site passes to you. If an offer pays $100 to the site and the rate is 85%, you receive $85. A 10-point difference on a $500 game offer is $50 - which is why we track rates for every site.", fr: "Le taux est la part du paiement annonceur que le site GPT vous reverse. Si une offre paie 100 $ au site et que le taux est de 85 %, vous recevez 85 $. Sur une offre à 500 $, 10 points d'écart font 50 $." } },
  { cat: "start", q: { en: "What's the difference between offerwalls like Torox, Prime Earn and RevU?", fr: "Quelle différence entre les offerwalls Torox, Prime Earn et RevU ?" }, a: { en: "Offerwalls are the networks that supply the offers; GPT sites simply embed them. Torox and Prime Earn are strong for long game offers with big milestones, RevU is popular for finance and casino offers with quick credit, BitLabs is surveys. The same game can appear on several walls at different prices.", fr: "Les offerwalls sont les réseaux qui fournissent les offres ; les sites GPT les intègrent. Torox et Prime Earn sont forts sur les longs jeux, RevU sur la finance et les casinos, BitLabs sur les sondages." } },
  { cat: "offers", q: { en: "Can I do multiple offers at the same time?", fr: "Puis-je faire plusieurs offres en même temps ?" }, a: { en: "Technically yes, but we recommend one game offer at a time. Tracking gets messy, you split your energy and one wrong click can void a milestone. Short finance or subscription offers can be stacked more safely.", fr: "Techniquement oui, mais nous recommandons une offre jeu à la fois. Le tracking devient confus et un mauvais clic peut annuler un palier. Les offres courtes (finance, abonnement) se cumulent plus facilement." } },
  { cat: "start", q: { en: "How much can I realistically earn per month?", fr: "Combien puis-je gagner par mois de façon réaliste ?" }, a: { en: "Casual users doing surveys and short offers land around $50-150/month. People who commit to one or two big game offers with guides regularly clear $300-800. Top earners in our Discord stack boosts and tournaments to pass $1,000, but that is a real part-time job.", fr: "Un utilisateur occasionnel gagne 50-150 $/mois. Ceux qui suivent une ou deux grosses offres jeu avec les guides atteignent régulièrement 300-800 $. Les meilleurs earners dépassent 1 000 $ en cumulant boosts et tournois." } },
  { cat: "payments", q: { en: "How fast do sites pay out?", fr: "En combien de temps les sites paient-ils ?" }, a: { en: "Earnlab and GemsLoot pay crypto in minutes. CashInStyle processes within 24 hours, Earnopolis within 1-3 hours. PayPal and gift cards are usually slower than crypto because of manual review.", fr: "Earnlab et GemsLoot paient en crypto en quelques minutes. CashInStyle sous 24 h, Earnopolis sous 1-3 h. PayPal et cartes cadeaux sont plus lents à cause de la vérification manuelle." } },
  { cat: "payments", q: { en: "Which payment methods are available?", fr: "Quels moyens de paiement sont disponibles ?" }, a: { en: "Most sites offer PayPal, Bitcoin, Litecoin, Ethereum, and gift cards (Amazon, Steam, Visa). Some also pay in Robux, Roobet/Gamdom balance or CS2 skins. Minimum withdrawals range from $0.50 to $5.", fr: "La plupart des sites proposent PayPal, Bitcoin, Litecoin, Ethereum et cartes cadeaux (Amazon, Steam, Visa). Certains paient aussi en Robux ou en skins CS2. Les minimums vont de 0,50 $ à 5 $." } },
  { cat: "payments", q: { en: "Do I have to pay taxes on GPT earnings?", fr: "Dois-je payer des impôts sur mes gains GPT ?" }, a: { en: "In most countries, yes - GPT income is taxable like any other side income once you pass your local threshold. Keep a simple spreadsheet of cashouts. We are not tax advisors; check your local rules.", fr: "Dans la plupart des pays, oui : les revenus GPT sont imposables comme tout revenu annexe au-delà du seuil local. Tenez un simple tableau de vos retraits. Nous ne sommes pas conseillers fiscaux." } },
  { cat: "safety", q: { en: "Are GPT sites safe and legit?", fr: "Les sites GPT sont-ils sûrs et légitimes ?" }, a: { en: "The sites listed here have paid our community for months or years. That said, never pay to join a site, never share passwords, and prefer crypto or PayPal over untested methods. If a site is not on our list, ask in the Discord first.", fr: "Les sites listés ici paient notre communauté depuis des mois ou des années. Ne payez jamais pour rejoindre un site, ne partagez jamais vos mots de passe. Si un site n'est pas dans la liste, demandez sur le Discord." } },
  { cat: "safety", q: { en: "Can I use a VPN or an emulator?", fr: "Puis-je utiliser un VPN ou un émulateur ?" }, a: { en: "No. Both are the fastest way to get banned and lose your balance. Offers are geo-targeted and fraud systems flag data-centre IPs and emulators immediately.", fr: "Non. C'est le moyen le plus rapide d'être banni et de perdre votre solde. Les offres sont géo-ciblées et les systèmes anti-fraude détectent immédiatement les IP de datacenter et les émulateurs." } },
  { cat: "start", q: { en: "What's the minimum age?", fr: "Quel est l'âge minimum ?" }, a: { en: "Most sites require 16+ (some 18+). Casino and sportsbook offers are always 18+ or 21+ depending on your country.", fr: "La plupart des sites exigent 16 ans minimum (parfois 18). Les offres casino et paris sportifs sont toujours 18+ ou 21+ selon le pays." } },
  { cat: "start", q: { en: "Does GPT Sites earn money from my sign-ups?", fr: "GPT Sites gagne-t-il de l'argent sur mes inscriptions ?" }, a: { en: "Yes - most links are referral links. It costs you nothing (some even give you a bonus) and it funds the guides, the tracker and the Discord.", fr: "Oui, la plupart des liens sont des liens de parrainage. Cela ne vous coûte rien (certains donnent même un bonus) et finance les guides, le tracker et le Discord." } },
];

/* ---------------------------------------------------------------- LIVE FEED */
// MOCKED stream. In production this pulls CashInStyle + SharkEarnings activity.
export const FEED_SOURCES = ["CashInStyle", "SharkEarnings"];
export const FEED_WALLS = allOfferwalls;

const USERS = ["lucas_x", "mia92", "kiro", "Nathan_B", "sofia.k", "Tomasz", "jay_dee", "Elena_R", "marco77", "Yuki", "Aaron_L", "Chloe", "dmitri", "Sam_W", "Isa", "Noah_P", "Léa", "Kenji", "Zoe_M", "Raf"];
const OFFERS = [
  ["Monopoly GO! - Reach level 25", "torox", 18, 42],
  ["Coin Master - 30 villages", "primeearn", 12, 35],
  ["Survey - 12 min", "bitlabs", 0.4, 2.8],
  ["Bingo Blitz - Level 60", "revu", 25, 55],
  ["Chime - $200 direct deposit", "revu", 120, 300],
  ["Gemini - Trade $100", "torox", 35, 70],
  ["RAID Shadow Legends - Level 30", "primeearn", 15, 60],
  ["Whiteout Survival - Furnace 15", "adgate", 20, 45],
  ["Eatventure - City 8", "primeearn", 30, 85],
  ["Solitaire Cash - 2 cash games", "revu", 8, 18],
  ["Survey - 6 min", "inbrain", 0.3, 1.5],
  ["Sunshine Island - Island 4", "primeearn", 40, 95],
  ["Royal Match - Level 100", "ayetstudios", 6, 14],
  ["Pokerist - Level 20", "torox", 10, 25],
  ["Lovable - Pro subscription", "torox", 15, 30],
  ["Watch videos - 30 ads", "lootably", 0.2, 0.9],
  ["Animal & Coins - Island 68", "primeearn", 12, 40],
  ["RealPrize - $10 pack", "revu", 18, 40],
  ["Timewall - 45 tasks", "timewall", 0.5, 3],
  ["Sea of Conquest - Flagship 15", "torox", 45, 120],
  ["Guns of Glory - Castle 18", "adscend", 25, 60],
  ["Helium Mobile - Activate plan", "revu", 20, 45],
  ["Lords Mobile - Castle 17", "pixylabs", 15, 40],
  ["Match Masters - Level 40", "notik", 5, 12],
  ["Survey - 18 min", "myChips", 0.8, 4],
  ["WaxRewards - Quiz pack", "waxrewards", 0.3, 1.2],
  ["Genshin Impact - AR 20", "adscend", 10, 25],
  ["DoorDash - 15 deliveries", "adscend", 60, 150],
];

let feedCounter = 0;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const makeFeedItem = (ageMs = 0) => {
  const [offer, wall, lo, hi] = pick(OFFERS);
  feedCounter += 1;
  return {
    id: `f-${Date.now()}-${feedCounter}`,
    user: pick(USERS),
    offer,
    wall,
    source: pick(FEED_SOURCES),
    amount: Math.round(rand(lo, hi) * 100) / 100,
    time: Date.now() - ageMs,
  };
};

export const seedFeed = (n = 28) =>
  Array.from({ length: n }, (_, i) => makeFeedItem(i * rand(60_000, 420_000))).sort((a, b) => b.time - a.time);
