import { useMemo, useState } from "react";
import { SITES } from "@/data/mock";

export const SITE_FILTERS = ["all", "new", "popular", "mobile", "casino", "bonus"];

export const countSitesFor = (filter) => {
  if (filter === "all") return SITES.length;
  if (filter === "bonus") return SITES.filter((s) => Boolean(s.bonus)).length;
  return SITES.filter((s) => s.tag === filter).length;
};

const matchesTag = (site, filter) => {
  if (filter === "all") return true;
  if (filter === "bonus") return Boolean(site.bonus);
  return site.tag === filter;
};

const matchesQuery = (site, q) => !q || `${site.name} ${site.tagline} ${site.bonus}`.toLowerCase().includes(q);

const rateOf = (site) => site.rateScore ?? site.rates?.max ?? -1;

const SORTERS = {
  rank: (a, b) => a.order - b.order,
  rate: (a, b) => rateOf(b) - rateOf(a) || a.order - b.order,
  name: (a, b) => a.name.localeCompare(b.name),
};

export const filterSites = ({ query, filter, wall, sort }) => {
  const q = query.trim().toLowerCase();
  const list = SITES.filter((s) => matchesTag(s, filter) && (wall === "all" || s.offerwalls.includes(wall)) && matchesQuery(s, q));
  return [...list].sort(SORTERS[sort] || SORTERS.rank);
};

export const useSiteFilters = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [wall, setWall] = useState("all");
  const [sort, setSort] = useState("rank");

  const results = useMemo(() => filterSites({ query, filter, wall, sort }), [query, filter, wall, sort]);

  const reset = () => {
    setQuery("");
    setFilter("all");
    setWall("all");
    setSort("rank");
  };

  return { query, setQuery, filter, setFilter, wall, setWall, sort, setSort, results, reset };
};
