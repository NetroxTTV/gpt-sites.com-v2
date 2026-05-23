export const siteAliases = {
  coinpayu: ["rewardjoy"],
  rewardjoy: ["coinpayu"],
};

export function getAliasTokens(values = []) {
  const tokens = new Set();

  values.forEach((value) => {
    if (!value) {
      return;
    }

    const text = String(value).toLowerCase();
    if (text) {
      tokens.add(text);
    }

    const aliases = siteAliases[text];
    if (aliases) {
      aliases.forEach((alias) => tokens.add(alias.toLowerCase()));
    }
  });

  return Array.from(tokens);
}
