import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteCard from "@/components/SiteCard";
import { otherSites, allOfferwalls } from "@/lib/sitesData";
import { Search, ArrowLeft, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const badgeFilters = ["All", "New", "Popular", "Mobile App"];
const badgeMap = { "All": null, "New": "new", "Popular": "popular", "Mobile App": "mobile_app" };

const offerwallLabels = {
  adgate: "AdGate", adgem: "AdGem", adscend: "AdScend", adtowall: "AdToWall",
  ayet: "AyeT", ayetstudios: "AyeT Studios", gemiwall: "GemiWall",
  hangmyads: "HangMyAds", lootably: "Lootably", mmwall: "MMWall",
  monlix: "Monlix", myChips: "myChips", notik: "Notik",
  primeearn: "PrimeEarn", revu: "Revu", timewall: "TimeWall",
  torox: "Torox", waxrewards: "WaxRewards",
};

export default function Sites() {
  const [search, setSearch] = useState("");
  const [activeBadge, setActiveBadge] = useState("All");
  const [selectedOfferwall, setSelectedOfferwall] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = otherSites.filter(site => {
    const matchesSearch =
      site.name.toLowerCase().includes(search.toLowerCase()) ||
      (site.description && site.description.toLowerCase().includes(search.toLowerCase()));
    const badgeFilter = badgeMap[activeBadge];
    const matchesBadge = !badgeFilter || site.badge === badgeFilter;
    const matchesOfferwall = !selectedOfferwall || (site.offerwalls && site.offerwalls.includes(selectedOfferwall));
    return matchesSearch && matchesBadge && matchesOfferwall;
  });

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
            <p className="text-muted-foreground">{otherSites.length} sites — find the best one for you</p>
          </motion.div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border/50 focus:border-primary/50"
              />
            </div>

            {/* Offerwall dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedOfferwall
                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/25"
                    : "bg-card border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {selectedOfferwall ? offerwallLabels[selectedOfferwall] : "Offerwall"}
                {selectedOfferwall ? (
                  <X
                    className="w-3.5 h-3.5 ml-1"
                    onClick={(e) => { e.stopPropagation(); setSelectedOfferwall(""); setDropdownOpen(false); }}
                  />
                ) : (
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute top-full mt-2 left-0 z-50 bg-card border border-border/50 rounded-xl shadow-xl py-2 min-w-[180px] max-h-72 overflow-y-auto">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
                    onClick={() => { setSelectedOfferwall(""); setDropdownOpen(false); }}
                  >
                    All Offerwalls
                  </button>
                  <div className="border-t border-border/30 my-1" />
                  {allOfferwalls.map(ow => (
                    <button
                      key={ow}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        selectedOfferwall === ow
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-secondary/50"
                      }`}
                      onClick={() => { setSelectedOfferwall(ow); setDropdownOpen(false); }}
                    >
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

          {/* Active offerwall tag */}
          {selectedOfferwall && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Showing sites with:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {offerwallLabels[selectedOfferwall]}
                <button onClick={() => setSelectedOfferwall("")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
              <span className="text-sm text-muted-foreground">— {filtered.length} sites found</span>
            </div>
          )}

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((site, i) => (
                <SiteCard key={site.name} site={site} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No sites found matching your filters.</p>
              <Button variant="ghost" size="sm" className="mt-3 text-primary" onClick={() => { setSearch(""); setActiveBadge("All"); setSelectedOfferwall(""); }}>
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