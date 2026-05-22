import React, { useState, useRef, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteCard from "@/components/SiteCard";
import { allSites, allOfferwalls } from "@/lib/sitesData";
import { Search, ArrowLeft, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const offerwallLabels = {
  adgate: "AdGate", gemiad: "GemiAd", adscend: "AdScend", adtowall: "AdToWall",
  ayetstudios: "AyeT Studios", bitlabs: "BitLabs",
  hangmyads: "HangMyAds", lootably: "Lootably", mmwall: "MMWall",
  monlix: "Monlix", myChips: "myChips", notik: "Notik",
  pixylabs: "PixyLabs", primeearn: "PrimeEarn", revu: "Revu", timewall: "TimeWall",
  torox: "Torox", waxrewards: "WaxRewards",
};

const badgeFilters = ["All", "New", "Popular", "Mobile App"];
const badgeMap = { "All": null, "New": "new", "Popular": "popular", "Mobile App": "mobile_app" };

export default function Sites() {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [search, setSearch] = useState("");
  const [activeBadge, setActiveBadge] = useState(() => {
    const badgeFromUrl = searchParams.get("tag");
    if (!badgeFromUrl) return "All";
    const badgeLabel = badgeFilters.find((label) => badgeMap[label] === badgeFromUrl);
    return badgeLabel || "All";
  });
  const [selectedOfferwalls, setSelectedOfferwalls] = useState(() => {
    const fromUrl = searchParams
      .get("offerwalls")
      ?.split(",")
      .map((value) => {
        const normalized = value.trim().toLowerCase();
        return normalized === "ayet" ? "ayetstudios" : normalized;
      })
      .filter(Boolean) || [];

    const unique = [...new Set(fromUrl)];
    return unique.filter((offerwall) => allOfferwalls.includes(offerwall));
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sortedOfferwalls = useMemo(
    () => [...new Set(allOfferwalls)].sort((a, b) => (offerwallLabels[a] || a).localeCompare(offerwallLabels[b] || b)),
    []
  );
  const topPicks = useMemo(() => {
    const ranked = allSites
      .filter((site) => /^top\d+$/i.test(site.badge || ""))
      .sort((a, b) => (a.badge || "").localeCompare(b.badge || ""));
    return ranked.slice(0, 3);
  }, []);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    const badgeValue = badgeMap[activeBadge];

    if (badgeValue) {
      nextParams.set("tag", badgeValue);
    } else {
      nextParams.delete("tag");
    }

    if (selectedOfferwalls.length > 0) {
      nextParams.set("offerwalls", selectedOfferwalls.join(","));
    } else {
      nextParams.delete("offerwalls");
    }

    const currentQuery = searchParams.toString();
    const nextQuery = nextParams.toString();
    if (nextQuery !== currentQuery) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [activeBadge, selectedOfferwalls, searchParams, setSearchParams]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleOfferwall = (ow) => {
    setSelectedOfferwalls(prev =>
      prev.includes(ow) ? prev.filter(x => x !== ow) : [...prev, ow]
    );
  };

  const filtered = allSites.filter(site => {
    const matchesSearch =
      site.name.toLowerCase().includes(search.toLowerCase()) ||
      (site.description && site.description.toLowerCase().includes(search.toLowerCase()));
    const badgeFilter = badgeMap[activeBadge];
    const matchesBadge = !badgeFilter || site.badge === badgeFilter;
    const matchesOfferwalls = selectedOfferwalls.length === 0 ||
      selectedOfferwalls.every(ow => site.offerwalls && site.offerwalls.includes(ow));
    return matchesSearch && matchesBadge && matchesOfferwalls;
  });

  // Sort by rate descending when offerwalls are selected
  const displayedSites = selectedOfferwalls.length > 0
    ? [...filtered].sort((a, b) => (b.rates || 0) - (a.rates || 0))
    : filtered;

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-16 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
              <span className="bg-gradient-to-r from-primary via-sky-500 to-accent bg-clip-text text-transparent">All GPT Sites</span>
            </h1>
            <p className="text-muted-foreground">{allSites.length} sites — find the best one for you this spring</p>
          </motion.div>

          <div className="mb-8 rounded-2xl border border-border/55 bg-card/70 backdrop-blur-sm p-4 sm:p-5 shadow-[0_12px_28px_rgba(59,130,246,0.14)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Top Picks By The Community</p>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Fastest payouts and best overall rates</h2>
              </div>
              <div className="text-sm text-muted-foreground">
                Start here if you want the highest odds of quick credits.
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topPicks.map((site, index) => (
                <SiteCard key={site.name} site={site} index={index} showRate showBadges={false} />
              ))}
            </div>
          </div>

          {/* Filters row */}
          <div className="relative z-40 flex flex-col sm:flex-row gap-3 mb-4 flex-wrap items-start rounded-2xl border border-border/55 bg-card/65 backdrop-blur-sm p-3 sm:p-4 shadow-[0_12px_28px_rgba(59,130,246,0.12)]">
            {/* Search */}
            <div className="relative min-w-[200px] max-w-sm w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background/80 border-border/60 focus:border-primary/50"
              />
            </div>

            {/* Offerwall multi-select dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${
                  selectedOfferwalls.length > 0
                    ? "bg-primary/12 text-primary border-primary/35 shadow-sm shadow-primary/15"
                    : "bg-background/80 border-border/45 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {selectedOfferwalls.length > 0 ? `${selectedOfferwalls.length} Offerwall${selectedOfferwalls.length > 1 ? "s" : ""} selected` : "Filter by Offerwall"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full mt-2 left-0 z-[70] bg-card border border-border/55 rounded-xl shadow-[0_14px_30px_rgba(59,130,246,0.18)] py-2 min-w-[200px] max-h-72 overflow-y-auto">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                    onClick={() => { setSelectedOfferwalls([]); }}
                  >
                    Clear all
                  </button>
                  <div className="border-t border-border/30 my-1" />
                  {sortedOfferwalls.map(ow => (
                    <button
                      key={ow}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                        selectedOfferwalls.includes(ow)
                          ? "bg-primary/12 text-primary font-medium"
                          : "text-foreground hover:bg-secondary/50"
                      }`}
                      onClick={() => toggleOfferwall(ow)}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 text-[10px] ${selectedOfferwalls.includes(ow) ? "bg-primary border-primary text-white" : "border-border/50"}`}>
                        {selectedOfferwalls.includes(ow) ? "✓" : ""}
                      </span>
                      {offerwallLabels[ow]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Badge filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {badgeFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveBadge(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeBadge === f
                      ? "bg-gradient-to-r from-primary via-sky-500 to-accent text-primary-foreground shadow-[0_8px_18px_rgba(59,130,246,0.24)]"
                      : "bg-background/80 border border-border/45 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Active offerwall tags */}
          {selectedOfferwalls.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <span className="text-sm text-muted-foreground">Showing sites with:</span>
              {selectedOfferwalls.map(ow => (
                <span key={ow} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {offerwallLabels[ow]}
                  <button onClick={() => toggleOfferwall(ow)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              <span className="text-sm text-muted-foreground">— {displayedSites.length} sites, sorted by rate</span>
            </div>
          )}

          {/* Grid */}
          {displayedSites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayedSites.map((site, i) => (
                <SiteCard key={site.name} site={site} index={i} showRate={selectedOfferwalls.length > 0} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No sites found matching your filters.</p>
              <Button variant="ghost" size="sm" className="mt-3 text-primary" onClick={() => { setSearch(""); setActiveBadge("All"); setSelectedOfferwalls([]); }}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}