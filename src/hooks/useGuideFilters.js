import { useMemo, useState } from "react";
import { GUIDES } from "@/data/content";
import { difficultyKey } from "@/lib/format";

export const GUIDE_WALLS = Array.from(new Set(GUIDES.flatMap((g) => g.offerwalls))).sort();

export const countGuidesFor = (category) => (category === "all" ? GUIDES.length : GUIDES.filter((g) => g.category === category).length);

const matchesQuery = (g, q) => !q || `${g.title} ${g.genre} ${g.platform} ${g.offerwalls.join(" ")}`.toLowerCase().includes(q);

const SORTERS = {
  best: null,
  payout: (a, b) => b.payoutValue - a.payoutValue,
  name: (a, b) => a.title.localeCompare(b.title),
};

export const filterGuides = ({ query, category, difficulty, wall, sort }) => {
  const q = query.trim().toLowerCase();
  const list = GUIDES.filter(
    (g) =>
      (category === "all" || g.category === category) &&
      (difficulty === "all" || difficultyKey(g.difficulty) === difficulty) &&
      (wall === "all" || g.offerwalls.includes(wall)) &&
      matchesQuery(g, q)
  );
  const sorter = SORTERS[sort];
  return sorter ? [...list].sort(sorter) : list;
};

export const useGuideFilters = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [wall, setWall] = useState("all");
  const [sort, setSort] = useState("best");

  const results = useMemo(() => filterGuides({ query, category, difficulty, wall, sort }), [query, category, difficulty, wall, sort]);

  const reset = () => {
    setQuery("");
    setCategory("all");
    setDifficulty("all");
    setWall("all");
    setSort("best");
  };

  return { query, setQuery, category, setCategory, difficulty, setDifficulty, wall, setWall, sort, setSort, results, reset };
};
