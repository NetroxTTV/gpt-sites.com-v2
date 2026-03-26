import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { base44 } from "@/api/base44Client";
import { Search, X, ChevronDown, ExternalLink, Monitor, Smartphone, Tablet, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import OfferDetailModal from "@/components/offers/OfferDetailModal";

const SORT_OPTIONS = [
  { label: "Highest Payout", value: "payout_desc" },
  { label: "Lowest Payout", value: "payout_asc" },
  { label: "Newest", value: "newest" },
  { label: "A-Z", value: "alpha" },
];

const PAGE_SIZE = 50;

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [sort, setSort] = useState("payout_desc");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [countryDropdown, setCountryDropdown] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);

  useEffect(() => {
    loadOffers();
  }, [page]);

  const loadOffers = async () => {
    setLoading(true);
    setError(null);
    const res = await base44.functions.invoke("getAdtowallOffers", { page, page_size: PAGE_SIZE });
    setOffers(prev => page === 1 ? res.data.offers : [...prev, ...res.data.offers]);
    setTotalCount(res.data.paging?.total_count || 0);
    setLoading(false);
  };

  const allCountries = useMemo(() => {
    const countryMap = {};
    offers.forEach(o => {
      (o.countries || []).forEach(c => {
        if (c.targeting_type === "include") countryMap[c.country_code] = c.label;
      });
    });
    return Object.entries(countryMap).sort((a, b) => a[1].localeCompare(b[1]));
  }, [offers]);

  const allCategories = useMemo(() => {
    const cats = new Set(offers.map(o => o.category).filter(Boolean));
    return ["All", ...Array.from(cats).sort()];
  }, [offers]);

  const filtered = useMemo(() => {
    let result = offers.filter(o => {
      const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "All" || o.category === selectedCategory;
      const matchCountry = selectedCountry === "All" || (o.countries || []).some(c => c.country_code === selectedCountry && c.targeting_type === "include");
      return matchSearch && matchCat && matchCountry;
    });

    return [...result].sort((a, b) => {
      if (sort === "payout_desc") return b.payout - a.payout;
      if (sort === "payout_asc") return a.payout - b.payout;
      if (sort === "newest") return b.time_created - a.time_created;
      if (sort === "alpha") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [offers, search, selectedCategory, selectedCountry, sort]);

  const hasMore = offers.length < totalCount;

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              AdToWall
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Offers</h1>
            <p className="text-muted-foreground">Browse all available offers — filter by country, category, and payout.</p>
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
                  {allCountries.map(([code, label]) => (
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
              {allCategories.slice(0, 6).map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                  {cat}
                </button>
              ))}
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

          <p className="text-xs text-muted-foreground mb-4">{filtered.length} offers{totalCount > offers.length ? ` (loaded ${offers.length} of ${totalCount})` : ""}</p>

          {/* Table */}
          {loading && offers.length === 0 ? (
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-card border border-border/30 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive">{error}</div>
          ) : (
            <>
              <div className="rounded-xl border border-border/40 overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] bg-secondary/50 px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/40 hidden sm:grid">
                  <span>Offer Name</span>
                  <span>Category</span>
                  <span>Countries</span>
                  <span>Payout</span>
                  <span>Status</span>
                </div>

                <div className="divide-y divide-border/30">
                  {filtered.map((offer, i) => (
                    <motion.button
                      key={offer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(i * 0.02, 0.4) }}
                      onClick={() => setSelectedOffer(offer)}
                      className="w-full grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-2 px-4 py-3 hover:bg-secondary/30 transition-colors text-left"
                    >
                      {/* Name + icon */}
                      <div className="flex items-center gap-3">
                        {offer.thumbnail_url ? (
                          <img src={offer.thumbnail_url} alt={offer.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-secondary" onError={e => e.target.style.display = 'none'} />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-secondary/80 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">{offer.name[0]}</div>
                        )}
                        <span className="text-sm font-semibold text-foreground truncate max-w-[200px]">{offer.name}</span>
                      </div>

                      {/* Category */}
                      <span className="text-xs text-muted-foreground sm:text-foreground">{offer.category}</span>

                      {/* Countries */}
                      <div className="flex flex-wrap gap-1">
                        {(offer.countries || []).filter(c => c.targeting_type === "include").slice(0, 3).map(c => (
                          <span key={c.country_code} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary/60 text-muted-foreground">{c.country_code}</span>
                        ))}
                        {(offer.countries || []).filter(c => c.targeting_type === "include").length > 3 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary/60 text-muted-foreground">+{offer.countries.filter(c => c.targeting_type === "include").length - 3}</span>
                        )}
                      </div>

                      {/* Payout */}
                      <span className="text-sm font-bold text-green-400">${offer.payout.toFixed(2)}</span>

                      {/* Status */}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${offer.status === "active" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-muted text-muted-foreground border border-border/40"}`}>
                        {offer.status?.toUpperCase()}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Loading..." : `Load More (${totalCount - offers.length} remaining)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <OfferDetailModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />

      <Footer />
    </div>
  );
}