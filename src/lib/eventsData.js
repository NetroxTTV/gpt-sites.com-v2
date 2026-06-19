export const events = [
  {
    title: "Gain.gg Torox $1500 Tournament",
    siteName: "Gain.gg",
    siteUrl: "https://gain.gg/r/netrox",
    dateRange: "Ends in 11 days",
    startDate: "2026-06-19",
    endDate: "2026-06-30",
    highlight: "Gain.gg is running a $1500 Torox tournament for top performers.",
    details: [
      "Prize pool: $1500.",
      "Complete Torox offers on Gain.gg to climb the leaderboard.",
      "Stats count from the moment you join — join early to maximize ranking.",
    ],
  },
  {
    title: "Earnopolis +30% on Torox",
    siteName: "Earnopolis",
    siteUrl: "https://earnopolis.com/r/?r=netrox",
    dateRange: "May 15 – Jun 1",
    startDate: "2026-05-15",
    endDate: "2026-06-01",
    highlight: "Torox payouts run at 110% on Earnopolis during this window.",
    details: [
      "Boost applies to any Torox offer completed on Earnopolis.",
      "Highest effective Torox rate available by a wide margin.",
      "Plan large offers here to maximize ROI.",
    ],
  },
  {
    title: "Earnlab +100% on Torox",
    siteName: "Earnlab",
    siteUrl: "https://earnlab.com/?aff=netrox",
    dateRange: "Jun 8 – Jun 13",
    startDate: "2026-06-08",
    endDate: "2026-06-13",
    highlight: "Torox payouts run at +100% on Earnlab during this window.",
    details: [
      "Boost applies to any Torox offer completed on Earnlab.",
      "This boost doubles Torox payouts — plan your large offers now.",
      "Promo ends in 5 days.",
    ],
  },
  {
    title: "GemsLoot BitLabs $300 Tournament",
    siteName: "GemsLoot",
    siteUrl: "https://gemsloot.com/?aff=netrox",
    dateRange: "Jun 6 – Jun 25",
    startDate: "2026-06-06",
    endDate: "2026-06-25",
    highlight: "GemsLoot is running a $300 BitLabs tournament for top performers.",
    details: [
      "Prize pool: $300.",
      "Complete BitLabs offers and surveys on GemsLoot to earn leaderboard points.",
      "Stats count from the moment you join — join early to maximize ranking.",
    ],
  },
  {
    title: "MyChips +50% Boost",
    siteName: "GemsLoot",
    siteUrl: "https://gemsloot.com/?aff=netrox",
    dateRange: "1 week only",
    startDate: "2026-05-23",
    endDate: "2026-05-30",
    highlight: "Get +50% extra on all MyChips offers on GemsLoot during this event.",
    details: [
      "Find the boosted offers directly on the MyChips Offerwall in GemsLoot.",
      "Boost applies to any MyChips offer completed during the event.",
      "Start earning more today with the limited-time payout increase.",
    ],
  },
  {
    title: "GemsLoot RevU $400 Tournament",
    siteName: "GemsLoot",
    siteUrl: "https://gemsloot.com/?aff=netrox",
    dateRange: "Ending soon",
    startDate: "2026-05-22",
    endDate: "2026-06-01",
    highlight: "GemsLoot is running a $400 RevU tournament for top performers.",
    details: [
      "Prize pool: $400.",
      "Complete RevU offers on GemsLoot to compete.",
    ],
  },
];

export const getDaysLeft = (endDate) => {
  if (!endDate) return null;
  const end = new Date(`${endDate}T23:59:59`);
  const diff = end.getTime() - Date.now();
  if (Number.isNaN(diff) || diff < 0) return null;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const activeEventCount = events.filter(
  (e) => getDaysLeft(e.endDate) !== null
).length;
