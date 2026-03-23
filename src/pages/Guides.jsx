import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { guides } from "@/lib/guidesData";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Clock, DollarSign, Search, SlidersHorizontal, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const UiButton = /** @type {any} */ (Button);
const UiInput = /** @type {any} */ (Input);

const FILTER_ACTIVE_CLASS = "bg-primary/12 text-primary border-primary/35 shadow-sm shadow-primary/15";
const FILTER_IDLE_CLASS = "bg-background/85 border-border/45 text-muted-foreground hover:text-foreground hover:border-primary/30";

const GUIDE_BATCH_SIZE = 9;
const SORT_OPTIONS = [
  { value: "best-match", label: "Best Match" },
  { value: "highest-reward", label: "Highest Reward" },
  { value: "quickest", label: "Quickest To Finish" },
  { value: "easiest", label: "Easiest First" },
  { value: "a-z", label: "Alphabetical A-Z" },
];

function toNumber(/** @type {string | number} */ value) {
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

  const parseRange = (/** @type {RegExp} */ pattern) => {
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

/**
 * @param {{ title: string; category: string; platform: string; genre: string; offerwall: string }} guide
 * @param {string} query
 */
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
  const [selectedOfferwalls, setSelectedOfferwalls] = useState(/** @type {string[]} */ ([]));
  const [sortBy, setSortBy] = useState("best-match");
  const [visibleCount, setVisibleCount] = useState(GUIDE_BATCH_SIZE);
  const [openDropdown, setOpenDropdown] = useState(
    /** @type {"category" | "difficulty" | "offerwall" | "sort" | null} */ (null)
  );

  useEffect(() => {
    const handler = (/** @type {{ target: EventTarget | null }} */ event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (!event.target.closest("[data-guide-dropdown]")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

    return Array.from(uniqueOfferwalls).sort((a, b) => a.localeCompare(b));
  }, []);

  const categoryCounts = useMemo(() => {
    return guides.reduce((acc, guide) => {
      acc[guide.category] = (acc[guide.category] || 0) + 1;
      return acc;
    }, /** @type {Record<string, number>} */ ({}));
  }, []);

  const selectedSortLabel = useMemo(() => {
    const found = SORT_OPTIONS.find((option) => option.value === sortBy);
    return found ? found.label : "Best Match";
  }, [sortBy]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredGuides = useMemo(() => {
    const filtered = guides.filter((guide) => {
      if (selectedCategory !== "All" && guide.category !== selectedCategory) {
        return false;
      }

      if (selectedDifficulty !== "All" && guide.difficulty !== selectedDifficulty) {
        return false;
      }

      if (selectedOfferwalls.length > 0) {
        const guideOfferwalls = splitOfferwalls(guide.offerwall);
        const matchesOfferwalls = selectedOfferwalls.every((offerwall) => guideOfferwalls.includes(offerwall));
        if (!matchesOfferwalls) {
          return false;
        }
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
  }, [normalizedQuery, selectedCategory, selectedDifficulty, selectedOfferwalls, sortBy]);

  const visibleGuides = filteredGuides.slice(0, visibleCount);
  const hasMoreGuides = visibleCount < filteredGuides.length;

  const activeFilterCount = [
    Boolean(normalizedQuery),
    selectedCategory !== "All",
    selectedDifficulty !== "All",
    selectedOfferwalls.length > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
    setSelectedOfferwalls([]);
    setSortBy("best-match");
    setVisibleCount(GUIDE_BATCH_SIZE);
    setOpenDropdown(null);
  };

  const onSingleSelect = (
    /** @type {(value: string) => void} */ setter,
    /** @type {string} */ value
  ) => {
    setter(value);
    setVisibleCount(GUIDE_BATCH_SIZE);
    setOpenDropdown(null);
  };

  const toggleOfferwall = (/** @type {string} */ offerwall) => {
    setSelectedOfferwalls((prev) =>
      prev.includes(offerwall) ? prev.filter((value) => value !== offerwall) : [...prev, offerwall]
    );
    setVisibleCount(GUIDE_BATCH_SIZE);
  };

  const getDropdownButtonClass = (/** @type {boolean} */ isActive) =>
    cn(
      "w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
      isActive
        ? FILTER_ACTIVE_CLASS
        : FILTER_IDLE_CLASS
    );

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-16 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 mb-4">
              Offer Guide Finder
            </span>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
                  <span className="bg-gradient-to-r from-primary via-rose-500 to-accent bg-clip-text text-transparent">Find The Right Guide Fast</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  Search by game, filter by difficulty and offerwall, then sort by what matters most. This layout scales cleanly even when your guide library grows to 30+ entries.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto">
                <div className="rounded-xl border border-border/50 bg-card/80 px-3 py-2 min-w-[96px] shadow-sm shadow-primary/10">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Guides</p>
                  <p className="text-lg font-bold text-foreground">{guides.length}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/80 px-3 py-2 min-w-[96px] shadow-sm shadow-primary/10">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Categories</p>
                  <p className="text-lg font-bold text-foreground">{categories.length - 1}</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/80 px-3 py-2 min-w-[96px] shadow-sm shadow-primary/10">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Offerwalls</p>
                  <p className="text-lg font-bold text-foreground">{offerwalls.length}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8 rounded-2xl border border-border/55 bg-card/65 backdrop-blur p-4 sm:p-5 shadow-[0_14px_34px_rgba(232,108,155,0.14)] sticky top-8 z-10"
          >
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <UiInput
                value={query}
                onChange={(/** @type {{ target: { value: string } }} */ event) => {
                  setQuery(event.target.value);
                  setVisibleCount(GUIDE_BATCH_SIZE);
                }}
                placeholder="Search guides by title, platform, category, offerwall..."
                className="pl-9 pr-10 bg-background/80 border-border/60"
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
              <div className="relative" data-guide-dropdown>
                <span className="text-xs text-muted-foreground block mb-1">Category</span>
                <button
                  type="button"
                  onClick={() => setOpenDropdown((prev) => (prev === "category" ? null : "category"))}
                  className={getDropdownButtonClass(selectedCategory !== "All")}
                >
                  <span className="truncate">{selectedCategory === "All" ? "All Categories" : selectedCategory}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openDropdown === "category" && "rotate-180")} />
                </button>
                {openDropdown === "category" && (
                  <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-card border border-border/55 rounded-xl shadow-[0_14px_30px_rgba(232,108,155,0.2)] py-2 max-h-72 overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => onSingleSelect(setSelectedCategory, category)}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm transition-colors",
                          selectedCategory === category
                            ? "bg-primary/12 text-primary font-medium"
                            : "text-foreground hover:bg-secondary/50"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" data-guide-dropdown>
                <span className="text-xs text-muted-foreground block mb-1">Difficulty</span>
                <button
                  type="button"
                  onClick={() => setOpenDropdown((prev) => (prev === "difficulty" ? null : "difficulty"))}
                  className={getDropdownButtonClass(selectedDifficulty !== "All")}
                >
                  <span className="truncate">{selectedDifficulty === "All" ? "All Difficulties" : selectedDifficulty}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openDropdown === "difficulty" && "rotate-180")} />
                </button>
                {openDropdown === "difficulty" && (
                  <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-card border border-border/55 rounded-xl shadow-[0_14px_30px_rgba(232,108,155,0.2)] py-2 max-h-72 overflow-y-auto">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() => onSingleSelect(setSelectedDifficulty, difficulty)}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm transition-colors",
                          selectedDifficulty === difficulty
                            ? "bg-primary/12 text-primary font-medium"
                            : "text-foreground hover:bg-secondary/50"
                        )}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" data-guide-dropdown>
                <span className="text-xs text-muted-foreground block mb-1">Offerwall</span>
                <button
                  type="button"
                  onClick={() => setOpenDropdown((prev) => (prev === "offerwall" ? null : "offerwall"))}
                  className={getDropdownButtonClass(selectedOfferwalls.length > 0)}
                >
                  <span className="truncate">
                    {selectedOfferwalls.length > 0
                      ? `${selectedOfferwalls.length} Offerwall${selectedOfferwalls.length > 1 ? "s" : ""} selected`
                      : "Filter by Offerwall"}
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openDropdown === "offerwall" && "rotate-180")} />
                </button>
                {openDropdown === "offerwall" && (
                  <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-card border border-border/55 rounded-xl shadow-[0_14px_30px_rgba(232,108,155,0.2)] py-2 max-h-72 overflow-y-auto">
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                      onClick={() => {
                        setSelectedOfferwalls([]);
                        setVisibleCount(GUIDE_BATCH_SIZE);
                      }}
                    >
                      Clear all
                    </button>
                    <div className="border-t border-border/30 my-1" />
                    {offerwalls.map((offerwall) => {
                      const isSelected = selectedOfferwalls.includes(offerwall);

                      return (
                        <button
                          key={offerwall}
                          type="button"
                          onClick={() => toggleOfferwall(offerwall)}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2",
                            isSelected
                                ? "bg-primary/12 text-primary font-medium"
                              : "text-foreground hover:bg-secondary/50"
                          )}
                        >
                          <span
                            className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 text-[10px]",
                              isSelected ? "bg-primary border-primary text-white" : "border-border/50"
                            )}
                          >
                            {isSelected ? "✓" : ""}
                          </span>
                          {offerwall}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="relative" data-guide-dropdown>
                <span className="text-xs text-muted-foreground block mb-1">Sort By</span>
                <button
                  type="button"
                  onClick={() => setOpenDropdown((prev) => (prev === "sort" ? null : "sort"))}
                  className={getDropdownButtonClass(sortBy !== "best-match")}
                >
                  <span className="truncate">{selectedSortLabel}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", openDropdown === "sort" && "rotate-180")} />
                </button>
                {openDropdown === "sort" && (
                  <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-card border border-border/55 rounded-xl shadow-[0_14px_30px_rgba(232,108,155,0.2)] py-2 max-h-72 overflow-y-auto">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onSingleSelect(setSortBy, option.value)}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm transition-colors",
                          sortBy === option.value
                            ? "bg-primary/12 text-primary font-medium"
                            : "text-foreground hover:bg-secondary/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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

            {selectedOfferwalls.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="text-sm text-muted-foreground">Offerwalls:</span>
                {selectedOfferwalls.map((offerwall) => (
                  <span
                    key={offerwall}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                  >
                    {offerwall}
                    <button
                      type="button"
                      onClick={() => toggleOfferwall(offerwall)}
                      aria-label={`Remove ${offerwall}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

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
                  <UiButton onClick={clearFilters} variant="ghost" size="sm" className="h-8">
                    Reset
                  </UiButton>
                )}
              </div>
            </div>
          </motion.div>

          <div className="space-y-4 max-w-5xl mx-auto">
            {visibleGuides.length === 0 && (
              <div className="rounded-2xl border border-border/60 bg-card/70 p-10 text-center">
                <h2 className="text-xl font-bold text-foreground mb-2">No guides found</h2>
                <p className="text-muted-foreground mb-4">Try a broader search or clear one of the filters.</p>
                <UiButton onClick={clearFilters} variant="outline">
                  Clear Filters
                </UiButton>
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
                <UiButton onClick={() => setVisibleCount((prev) => prev + GUIDE_BATCH_SIZE)} variant="outline" size="lg">
                  Load {Math.min(GUIDE_BATCH_SIZE, filteredGuides.length - visibleCount)} More Guides
                </UiButton>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}