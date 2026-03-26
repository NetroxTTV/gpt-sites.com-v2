import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, X, ChevronDown, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { allOfferwalls, allSites } from "@/lib/sitesData";

const SORT_OPTIONS = [
  { label: "Highest Payout", value: "payout_desc" },
  { label: "Lowest Payout", value: "payout_asc" },
  { label: "Newest", value: "newest" },
  { label: "A-Z", value: "alpha" },
];

const COUNTRY_OPTIONS = [
  ["US", "United States"],
  ["CA", "Canada"],
  ["UK", "United Kingdom"],
  ["DE", "Germany"],
  ["FR", "France"],
  ["AU", "Australia"],
  ["NZ", "New Zealand"],
  ["ES", "Spain"],
  ["IT", "Italy"],
  ["NL", "Netherlands"],
];

const CATEGORY_OPTIONS = ["All", "Games", "Casino", "Finance", "Survey", "Other"];

export default function Offers() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [sort, setSort] = useState("payout_desc");
  const [countryDropdown, setCountryDropdown] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);
  const [offerwallDropdown, setOfferwallDropdown] = useState(false);
  const [selectedWalls, setSelectedWalls] = useState([]);

  const allWalls = useMemo(() => {
    const fromSites = allSites.flatMap((site) => Array.isArray(site.offerwalls) ? site.offerwalls : []);
    const set = new Set([...allOfferwalls, ...fromSites].map((wall) => String(wall || "").toLowerCase()).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const toggleWall = (wall) => {
    setSelectedWalls((prev) =>
      prev.includes(wall) ? prev.filter((w) => w !== wall) : [...prev, wall]
    );
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Offers</h1>
            <p className="text-muted-foreground">Use search and filters to prepare your offer lookup.</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-card border-border/50 focus:border-primary/50"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Country dropdown */}
            <div className="relative">
              <button
                onClick={() => { setCountryDropdown(!countryDropdown); setSortDropdown(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${selectedCountry !== "All" ? "bg-primary/10 text-primary border-primary/30" : "bg-card border-border/40 text-muted-foreground hover:text-foreground"}`}
              >
                {selectedCountry === "All" ? "All Countries" : selectedCountry}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${countryDropdown ? "rotate-180" : ""}`} />
              </button>
              {countryDropdown && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-card border border-border/50 rounded-xl shadow-xl py-2 w-52 max-h-64 overflow-y-auto">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 text-foreground" onClick={() => { setSelectedCountry("All"); setCountryDropdown(false); }}>All Countries</button>
                  <div className="border-t border-border/30 my-1" />
                  {COUNTRY_OPTIONS.map(([code, label]) => (
                    <button key={code} className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedCountry === code ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary/50"}`}
                      onClick={() => { setSelectedCountry(code); setCountryDropdown(false); }}>
                      {label} ({code})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORY_OPTIONS.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Offerwall multi-select */}
            <div className="relative">
              <button
                onClick={() => { setOfferwallDropdown(!offerwallDropdown); setSortDropdown(false); setCountryDropdown(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${selectedWalls.length > 0 ? "bg-primary/10 text-primary border-primary/30" : "bg-card border-border/40 text-muted-foreground hover:text-foreground"}`}
              >
                {selectedWalls.length > 0 ? `${selectedWalls.length} wall${selectedWalls.length > 1 ? "s" : ""}` : "All Offerwalls"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${offerwallDropdown ? "rotate-180" : ""}`} />
              </button>
              {offerwallDropdown && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-card border border-border/50 rounded-xl shadow-xl py-2 w-56 max-h-64 overflow-y-auto">
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 text-foreground"
                    onClick={() => setSelectedWalls([])}
                  >
                    Clear all
                  </button>
                  <div className="border-t border-border/30 my-1" />
                  {allWalls.map((wall) => (
                    <button
                      key={wall}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${selectedWalls.includes(wall) ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary/50"}`}
                      onClick={() => toggleWall(wall)}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${selectedWalls.includes(wall) ? "bg-primary border-primary text-white" : "border-border/50"}`}>
                        {selectedWalls.includes(wall) ? "✓" : ""}
                      </span>
                      {wall.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative ml-auto">
              <button
                onClick={() => { setSortDropdown(!sortDropdown); setCountryDropdown(false); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/40 bg-card text-sm font-medium text-muted-foreground hover:text-foreground transition-all whitespace-nowrap"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {SORT_OPTIONS.find(s => s.value === sort)?.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDropdown ? "rotate-180" : ""}`} />
              </button>
              {sortDropdown && (
                <div className="absolute top-full mt-1 right-0 z-50 bg-card border border-border/50 rounded-xl shadow-xl py-2 w-44">
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => { setSort(opt.value); setSortDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${sort === opt.value ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary/50"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            0 offers
          </p>

          <div className="rounded-xl border border-border/40 bg-card/40 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No offers displayed</p>
            <p className="text-sm text-muted-foreground">
              The offers list is intentionally disabled. Search and filter controls are still available.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}