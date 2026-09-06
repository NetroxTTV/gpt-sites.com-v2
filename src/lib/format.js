export const fmtMoney = (n) => {
  const v = Number(n) || 0;
  return v >= 100 ? `$${v.toFixed(0)}` : `$${v.toFixed(2)}`;
};

export const timeAgo = (ts, t) => {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return t("feed.justNow");
  if (m < 60) return `${m} ${t("feed.minAgo")}`;
  const h = Math.floor(m / 60);
  return `${h} ${t("feed.hAgo")}`;
};

export const difficultyKey = (d) => {
  const s = (d || "").toLowerCase();
  if (s.includes("easy")) return "easy";
  if (s.includes("hard")) return "hard";
  if (s.includes("medium")) return "medium";
  return null;
};

export const difficultyClass = (d) => {
  const k = difficultyKey(d);
  if (k === "easy") return "text-mint bg-mint-soft border-mint/30";
  if (k === "hard") return "text-rose bg-rose-soft border-rose/30";
  if (k === "medium") return "text-amber bg-amber-soft border-amber/30";
  return "text-muted-foreground bg-secondary border-border";
};
