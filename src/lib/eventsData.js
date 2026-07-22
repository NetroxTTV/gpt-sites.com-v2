export const events = [
  {
    title: "$67.50 WaxRewards Leaderboard",
    siteName: "RBXFast",
    siteUrl: "https://rbxfast.com/r/netrox",
    dateRange: "Ends in 10d 16h",
    startDate: "2026-07-22",
    endDate: "2026-08-02",
    highlight: "Win $67.50 in a WaxRewards leaderboard on RBXFast - climb the rankings now.",
    details: [
      "Prize pool: $67.50.",
      "Do WaxRewards offers on RBXFast to climb the leaderboard.",
    ],
  },
  {
    title: "GemsLoot RevU $400 Tourney + 25% Bonus",
    siteName: "GemsLoot",
    siteUrl: "https://gemsloot.com/?aff=netrox",
    dateRange: "Jul 16 – Jul 31",
    startDate: "2026-07-16",
    endDate: "2026-07-31",
    highlight: "RevU $400 Tourney is live on GemsLoot, plus enjoy a 25% bonus on all offers until July 31st.",
    details: [
      "RevU tournament prize pool: $400.",
      "Get a 25% bonus on all offers on GemsLoot through July 31st.",
      "Tap in now while both promos are active.",
    ],
  },
  {
    title: "CashInStyle x AdscendMedia $100 Contest – Complete Offers & Win!",
    siteName: "AdscendMedia",
    siteUrl: "https://adscendmedia.com/r/netrox",
    dateRange: "Jul 15 – Jul 31",
    startDate: "2026-07-15",
    endDate: "2026-07-31",
    highlight: "Join the CashInStyle x AdscendMedia $100 prize contest and climb the leaderboard by completing offers.",
    details: [
      "Prize pool: $100.",
      "Complete AdscendMedia offers to earn leaderboard points.",
      "Event runs from July 15th through July 31st - join early to maximize your ranking.",
    ],
  },
  {
    title: "$100 myChips Tournament",
    siteName: "SharkEarnings",
    siteUrl: "https://sharkearnings.com/r/netrox",
    dateRange: "Ending soon",
    startDate: "2026-07-11",
    endDate: "2026-07-18",
    highlight: "Compete in the $100 myChips Tournament and climb the leaderboard for your chance to win.",
    details: [
      "Prize pool: $100.",
      "Complete myChips offers to earn leaderboard points.",
      "Navigate to the Prizes tab to join and track your progress.",
    ],
  },
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

/**
 * @param {string | null | undefined} endDate
 */
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
