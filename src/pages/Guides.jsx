import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { guides } from "@/lib/guidesData";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, DollarSign, Search, SlidersHorizontal, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const GUIDE_BATCH_SIZE = 9;

function toNumber(value) {
  return Number(String(value).replace(/,/g, ""));
}

function getRewardCeiling(rewardText = "") {
  const matches = rewardText.match(/\d[\d,.]*/g);
  if (!matches?.length) {
    return 0;
  }

  return Math.max(...matches.map(toNumber));
}

function getEstimatedHours(timeText = "") {
  const normalized = timeText.toLowerCase();

  const parseRange = (pattern) => {
    const match = normalized.match(pattern);
    if (!match) {
      return null;
    }

    const start = toNumber(match[1]);
    const end = match[2] ? toNumber(match[2]) : start;
    return (start + end) / 2;
  };

  const hours = parseRange(/(\d[\d,.]*)\s*(?:-|to|–|—)?\s*(\d[\d,.]*)?\s*hours?/i);
  if (hours !== null) {
    return hours;
  }

  const days = parseRange(/(\d[\d,.]*)\s*(?:-|to|–|—)?\s*(\d[\d,.]*)?\s*days?/i);
  if (days !== null) {
    return days * 24;
  }

  const minutes = parseRange(/(\d[\d,.]*)\s*(?:-|to|–|—)?\s*(\d[\d,.]*)?\s*minutes?/i);
  if (minutes !== null) {
    return minutes / 60;
  }

  return Number.POSITIVE_INFINITY;
}

function getDifficultyRank(difficultyText = "") {
  const normalized = difficultyText.toLowerCase();
  if (normalized.includes("easy")) {
    return 1;
  }

  if (normalized.includes("medium")) {
    return 2;
  }

  if (normalized.includes("hard")) {
    return 3;
  }

  return 4;
}

function splitOfferwalls(offerwallText = "") {
  return offerwallText
    .split(/\/|\|/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function getSearchScore(guide, query) {
  if (!query) {
    return 0;
  }

  const title = guide.title.toLowerCase();
  const category = guide.category.toLowerCase();
  const platform = guide.platform.toLowerCase();
  const genre = guide.genre.toLowerCase();
  const offerwalls = splitOfferwalls(guide.offerwall).join(" ").toLowerCase();

  let score = 0;

  if (title === query) {
    score += 200;
  } else if (title.startsWith(query)) {
    score += 140;
  } else if (title.includes(query)) {
    score += 110;
  }

  if (category.includes(query)) {
    score += 40;
  }

  if (genre.includes(query)) {
    score += 30;
  }

  if (platform.includes(query)) {
    score += 25;
  }

  if (offerwalls.includes(query)) {
    score += 35;
  }

  return score;
}

export default function Guides() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedOfferwall, setSelectedOfferwall] = useState("All");
  const [sortBy, setSortBy] = useState("best-match");
  const [visibleCount, setVisibleCount] = useState(GUIDE_BATCH_SIZE);

  const categories = useMemo(() => {
    return ["All", ...new Set(guides.map((guide) => guide.category))];
  }, []);

  const difficulties = useMemo(() => {
    const uniqueDifficulties = [...new Set(guides.map((guide) => guide.difficulty))];
    return [
      "All",
      ...uniqueDifficulties.sort((a, b) => getDifficultyRank(a) - getDifficultyRank(b) || a.localeCompare(b)),
    ];
  }, []);

  const offerwalls = useMemo(() => {
    const uniqueOfferwalls = new Set();

    guides.forEach((guide) => {
      splitOfferwalls(guide.offerwall).forEach((offerwall) => {
        uniqueOfferwalls.add(offerwall);
      });
    });

    return ["All", ...Array.from(uniqueOfferwalls).sort((a, b) => a.localeCompare(b))];
  }, []);

  const categoryCounts = useMemo(() => {
    return guides.reduce((acc, guide) => {
      acc[guide.category] = (acc[guide.category] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredGuides = useMemo(() => {
    const filtered = guides.filter((guide) => {
      if (selectedCategory !== "All" && guide.category !== selectedCategory) {
        return false;
      }

      if (selectedDifficulty !== "All" && guide.difficulty !== selectedDifficulty) {
        return false;
      }

      if (selectedOfferwall !== "All" && !splitOfferwalls(guide.offerwall).includes(selectedOfferwall)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        guide.title,
        guide.category,
        guide.platform,
        guide.genre,
        guide.offerwall,
        guide.difficulty,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });

    return filtered.sort((a, b) => {
      if (sortBy === "best-match") {
        if (normalizedQuery) {
          const scoreDiff = getSearchScore(b, normalizedQuery) - getSearchScore(a, normalizedQuery);
          if (scoreDiff !== 0) {
            return scoreDiff;
          }
        }

        const rewardDiff = getRewardCeiling(b.totalReward) - getRewardCeiling(a.totalReward);
        if (rewardDiff !== 0) {
          return rewardDiff;
        }

        return a.title.localeCompare(b.title);
      }

      if (sortBy === "highest-reward") {
        return getRewardCeiling(b.totalReward) - getRewardCeiling(a.totalReward);
      }

      if (sortBy === "quickest") {
        return getEstimatedHours(a.timeInvestment) - getEstimatedHours(b.timeInvestment);
      }

      if (sortBy === "easiest") {
        const difficultyDiff = getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty);
        if (difficultyDiff !== 0) {
          return difficultyDiff;
        }

        return getRewardCeiling(b.totalReward) - getRewardCeiling(a.totalReward);
      }

      return a.title.localeCompare(b.title);
    });
  }, [normalizedQuery, selectedCategory, selectedDifficulty, selectedOfferwall, sortBy]);

  const visibleGuides = filteredGuides.slice(0, visibleCount);
  const hasMoreGuides = visibleCount < filteredGuides.length;

  const activeFilterCount = [
    Boolean(normalizedQuery),
    selectedCategory !== "All",
    selectedDifficulty !== "All",
    selectedOfferwall !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
    setSelectedOfferwall("All");
    setSortBy("best-match");
    setVisibleCount(GUIDE_BATCH_SIZE);
  };

  const onFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setVisibleCount(GUIDE_BATCH_SIZE);
  };

  const selectClassName =
    "h-9 rounded-md border border-border/50 bg-background/90 px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              Offer Guide Finder
            </span>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Find The Right Guide Fast</h1>
                <p className="text-muted-foreground max-w-2xl">
                  Search by game, filter by difficulty and offerwall, then sort by what matters most. This layout scales cleanly even when your guide library grows to 30+ entries.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto">
                <div className="rounded-xl border border-border/50 bg-card/70 px-3 py-2 min-w-[96px]">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Guides</p>
                  <p className="text-lg font-bold text-foreground">{guides.length}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/70 px-3 py-2 min-w-[96px]">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Categories</p>
                  <p className="text-lg font-bold text-foreground">{categories.length - 1}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/70 px-3 py-2 min-w-[96px]">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Offerwalls</p>
                  <p className="text-lg font-bold text-foreground">{offerwalls.length - 1}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="sticky top-[74px] z-20 mb-8 rounded-2xl border border-border/50 bg-background/95 backdrop-blur p-4 sm:p-5 shadow-lg shadow-black/10"
          >
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(GUIDE_BATCH_SIZE);
                }}
                placeholder="Search guides by title, platform, category, offerwall..."
                className="pl-9 pr-10 bg-card/70 border-border/60"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setVisibleCount(GUIDE_BATCH_SIZE);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Category</span>
                <select value={selectedCategory} onChange={onFilterChange(setSelectedCategory)} className={selectClassName}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Difficulty</span>
                <select value={selectedDifficulty} onChange={onFilterChange(setSelectedDifficulty)} className={selectClassName}>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Offerwall</span>
                <select value={selectedOfferwall} onChange={onFilterChange(setSelectedOfferwall)} className={selectClassName}>
                  {offerwalls.map((offerwall) => (
                    <option key={offerwall} value={offerwall}>
                      {offerwall}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Sort By</span>
                <select value={sortBy} onChange={onFilterChange(setSortBy)} className={selectClassName}>
                  <option value="best-match">Best Match</option>
                  <option value="highest-reward">Highest Reward</option>
                  <option value="quickest">Quickest To Finish</option>
                  <option value="easiest">Easiest First</option>
                  <option value="a-z">Alphabetical A-Z</option>
                </select>
              </label>
            </div>

            <div className="mb-4 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 min-w-max">
                {categories.map((category) => {
                  const isActive = selectedCategory === category;
                  const guideCount = category === "All" ? guides.length : categoryCounts[category] || 0;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category);
                        setVisibleCount(GUIDE_BATCH_SIZE);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card/60 text-muted-foreground border-border/60 hover:text-foreground hover:border-primary/40"
                      )}
                    >
                      {category} ({guideCount})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
              <p className="text-muted-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Showing <span className="font-semibold text-foreground">{visibleGuides.length}</span> of{" "}
                <span className="font-semibold text-foreground">{filteredGuides.length}</span> guides
              </p>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <span className="text-xs text-muted-foreground">{activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active</span>
                )}
                {(activeFilterCount > 0 || sortBy !== "best-match") && (
                  <Button onClick={clearFilters} variant="ghost" size="sm" className="h-8">
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {visibleGuides.length === 0 && (
              <div className="rounded-2xl border border-border/60 bg-card/70 p-10 text-center">
                <h2 className="text-xl font-bold text-foreground mb-2">No guides found</h2>
                <p className="text-muted-foreground mb-4">Try a broader search or clear one of the filters.</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}

            {visibleGuides.map((guide, index) => (
              <motion.div
                key={guide.slug}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: index * 0.03 }}
              >
                <Link to={`/Guides/${guide.slug}`} className="group block">
                  <article className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-0 rounded-2xl bg-card border border-border/40 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="h-36 sm:h-auto overflow-hidden bg-secondary/40">
                      <img
                        src={guide.banner}
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    </div>

                    <div className="p-5 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            {guide.category}
                          </span>
                          {splitOfferwalls(guide.offerwall).slice(0, 2).map((offerwall) => (
                            <span key={`${guide.slug}-${offerwall}`} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-secondary/70 text-muted-foreground border border-border/50">
                              {offerwall}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                          {guide.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mb-3">{guide.platform} • {guide.genre}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-background/50 px-2.5 py-2">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {guide.timeInvestment}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-background/50 px-2.5 py-2 font-semibold text-foreground">
                            <DollarSign className="w-3.5 h-3.5 text-primary" />
                            {guide.totalReward}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-background/50 px-2.5 py-2">
                            <Zap className="w-3.5 h-3.5 text-primary" />
                            {guide.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                        Open Guide
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}

            {hasMoreGuides && (
              <div className="pt-2 text-center">
                <Button onClick={() => setVisibleCount((prev) => prev + GUIDE_BATCH_SIZE)} variant="outline" size="lg">
                  Load {Math.min(GUIDE_BATCH_SIZE, filteredGuides.length - visibleCount)} More Guides
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}