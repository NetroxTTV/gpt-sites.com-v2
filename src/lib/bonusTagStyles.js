const casinoBonusTagClassNames = {
  gamdom: "casino-tag casino-tag-gamdom",
  roobet: "casino-tag casino-tag-roobet",
  stake: "casino-tag casino-tag-stake",
};

export function getCasinoBonusTagClassName(bonusTag) {
  if (!bonusTag) {
    return "";
  }

  const normalizedTag = bonusTag.toLowerCase();

  if (normalizedTag.includes("gamdom")) {
    return casinoBonusTagClassNames.gamdom;
  }

  if (normalizedTag.includes("roobet")) {
    return casinoBonusTagClassNames.roobet;
  }

  if (normalizedTag.includes("stake")) {
    return casinoBonusTagClassNames.stake;
  }

  return "";
}
