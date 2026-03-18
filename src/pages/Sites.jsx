import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteCard from "@/components/SiteCard";
import { allSites, allOfferwalls } from "@/lib/sitesData";
import { Search, ArrowLeft, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const offerwallLabels = {
  adgate: "AdGate", adgem: "AdGem", adscend: "AdScend", adtowall: "AdToWall",
  ayet: "AyeT", ayetstudios: "AyeT Studios", gemiwall: "GemiWall",
  hangmyads: "HangMyAds", lootably: "Lootably", mmwall: "MMWall",
  monlix: "Monlix", myChips: "myChips", notik: "Notik",
  primeearn: "PrimeEarn", revu: "Revu", timewall: "TimeWall",
  torox: "Torox", waxrewards: "WaxRewards",
};

const badgeFilters = ["All", "New", "Popular", "Mobile App"];
const badgeMap = { "All": null, "New": "new", "Popular": "popular", "Mobile App": "mobile_app" };

export default function Sites() {
  const [search, setSearch] = useState("");
  const [activeBadge, setActiveBadge] = useState("All");
  const [selectedOfferwalls, setSelectedOfferwalls] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">All GPT Sites</h1>
            <p className="text-muted-foreground">{allSites.length} sites — find the best one for you</p>
          </motion.div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4 flex-wrap items-start">
            {/* Search */}
            <div className="relative min-w-[200px] max-w-sm w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border/50 focus:border-primary/50"
              />
            </div>

            {/* Offerwall multi-select dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${
                  selectedOfferwalls.length > 0
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-card border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {selectedOfferwalls.length > 0 ? `${selectedOfferwalls.length} Offerwall${selectedOfferwalls.length > 1 ? "s" : ""} selected` : "Filter by Offerwall"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full mt-2 left-0 z-50 bg-card border border-border/50 rounded-xl shadow-xl py-2 min-w-[200px] max-h-72 overflow-y-auto">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                    onClick={() => { setSelectedOfferwalls([]); }}
                  >
                    Clear all
                  </button>
                  <div className="border-t border-border/30 my-1" />
                  {allOfferwalls.map(ow => (
                    <button
                      key={ow}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                        selectedOfferwalls.includes(ow)
                          ? "bg-primary/10 text-primary font-medium"
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
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"
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