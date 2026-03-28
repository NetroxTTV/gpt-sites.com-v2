import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { base44 } from "@/api/base44Client";
import { Search, X, ChevronDown, ExternalLink, Monitor, Smartphone, Tablet, ArrowUpDown, Apple } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import OfferDetailModal from "@/components/offers/OfferDetailModal";

const SORT_OPTIONS = [
  { label: "Highest Payout", value: "payout_desc" },
  { label: "Lowest Payout", value: "payout_asc" },
  { label: "Newest", value: "newest" },
  { label: "A-Z", value: "alpha" },
];

const PAGE_SIZE = 50;

const DEVICE_ICONS = {
  desktop: <Monitor className="w-3.5 h-3.5" />,
  android: <Smartphone className="w-3.5 h-3.5" />,
  ios: <Apple className="w-3.5 h-3.5" />,
  tablet: <Tablet className="w-3.5 h-3.5" />,
};

function getDeviceIcons(platforms = [], deviceTypes = []) {
  const icons = [];
  const allText = [...platforms, ...deviceTypes].map(d =>
    (d.name || d.device_name || d || "").toLowerCase()
  );
  const unique = new Set();
  allText.forEach(t => {
    if (t.includes("ios") || t.includes("apple")) unique.add("ios");
    else if (t.includes("android")) unique.add("android");
    else if (t.includes("desktop") || t.includes("web") || t.includes("pc") || t.includes("windows")) unique.add("desktop");
    else if (t.includes("tablet")) unique.add("tablet");
  });
  return Array.from(unique);
}

function timeAgo(timestamp) {
  if (!timestamp) return "";
  const diff = Date.now() - timestamp * 1000;
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? "s" : ""} ago`;
}

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

  useEffect(() => { loadOffers(); }, [page]);

  const loadOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("getAdtowallOffers", { page, page_size: PAGE_SIZE });
      const incoming = res?.data?.offers || [];
      setOffers(prev => page === 1 ? incoming : [...prev, ...incoming]);
      setTotalCount(res?.data?.paging?.total_count || 0);
    } catch (err) {
      setError(err?.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
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
      const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || (o.category || "").toLowerCase().includes(search.toLowerCase());
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

      {/* Hero */}
      <div className="pt-24 pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              AdToWall
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
              <span className="bg-gradient-to-r from-primary via-rose-500 to-accent bg-clip-text text-transparent">Offers</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Explore high paying offers from top providers. Find the best offers and complete them on our recommended GPT sites.
            </p>
          </motion.div>

          {/* Filters bar */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="flex flex-col sm:flex-row gap-3 mb-4 flex-wrap items-start rounded-2xl border border-border/55 bg-card/65 backdrop-blur-sm p-3 sm:p-4 shadow-[0_12px_28px_rgba(232,108,155,0.10)]">

            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search offers..." value={search} onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-background/80 border-border/60 focus:border-primary/50" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Country dropdown */}
            <div className="relative">
              <button onClick={() => { setCountryDropdown(!countryDropdown); setSortDropdown(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${selectedCountry !== "All" ? "bg-primary/10 text-primary border-primary/30" : "bg-background/80 border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
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

            {/* Category pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {allCategories.slice(0, 7).map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${selectedCategory === cat ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background/80 border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative ml-auto">
              <button onClick={() => { setSortDropdown(!sortDropdown); setCountryDropdown(false); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/40 bg-background/80 text-sm font-medium text-muted-foreground hover:text-foreground transition-all whitespace-nowrap">
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
          </motion.div>

          <p className="text-xs text-muted-foreground mb-3 px-1">
            {filtered.length} offers{totalCount > offers.length ? ` (loaded ${offers.length} of ${totalCount})` : ""}
          </p>

          {/* Table */}
          {loading && offers.length === 0 ? (
            <div className="rounded-2xl border border-border/40 overflow-hidden">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`h-16 animate-pulse ${i % 2 === 0 ? "bg-card" : "bg-secondary/20"}`} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 rounded-2xl border border-border/40 bg-card">
              <p className="text-destructive font-medium">{error}</p>
              <button onClick={loadOffers} className="mt-3 text-sm text-primary hover:underline">Try again</button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border/40 overflow-hidden shadow-[0_8px_24px_rgba(232,108,155,0.08)]">

              {/* Table header — desktop only */}
              <div className="hidden sm:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] bg-secondary/40 px-5 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40">
                <span>Offer Name</span>
                <span>Offerwall</span>
                <span>Category</span>
                <span>Pays</span>
                <span>Devices</span>
                <span>Added</span>
              </div>

              <div className="divide-y divide-border/25">
                {filtered.map((offer, i) => {
                  const devices = getDeviceIcons(offer.platforms, offer.device_types);
                  const includedCountries = (offer.countries || []).filter(c => c.targeting_type === "include");
                  return (
                    <motion.button
                      key={offer.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(i * 0.015, 0.3) }}
                      onClick={() => setSelectedOffer(offer)}
                      className="w-full grid grid-cols-1 sm:grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] items-center gap-y-1 gap-x-3 px-5 py-3.5 hover:bg-primary/5 transition-colors text-left group"
                    >
                      {/* Name */}
                      <div className="flex items-center gap-3">
                        {offer.thumbnail_url ? (
                          <img src={offer.thumbnail_url} alt={offer.name}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-border/30"
                            onError={e => { e.target.style.display = 'none'; }} />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary border border-border/20">
                            {offer.name[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{offer.name}</p>
                          {includedCountries.length > 0 && (
                            <p className="text-[11px] text-muted-foreground truncate sm:hidden">
                              {includedCountries.slice(0, 3).map(c => c.country_code).join(", ")}
                              {includedCountries.length > 3 ? ` +${includedCountries.length - 3}` : ""}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Offerwall */}
                      <div className="hidden sm:flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-secondary/60 text-foreground border border-border/30">
                          AdToWall
                        </span>
                      </div>

                      {/* Category */}
                      <span className="hidden sm:block text-sm text-muted-foreground">{offer.category}</span>

                      {/* Payout */}
                      <span className="text-sm font-extrabold text-green-500 sm:block hidden">${offer.payout.toFixed(2)}</span>

                      {/* Mobile: payout inline */}
                      <div className="flex items-center justify-between sm:hidden">
                        <span className="text-xs text-muted-foreground">{offer.category}</span>
                        <span className="text-sm font-extrabold text-green-500">${offer.payout.toFixed(2)}</span>
                      </div>

                      {/* Devices */}
                      <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
                        {devices.length > 0 ? devices.map(d => (
                          <span key={d} title={d}>{DEVICE_ICONS[d]}</span>
                        )) : <span className="text-xs text-muted-foreground/40">—</span>}
                      </div>

                      {/* Added */}
                      <span className="hidden sm:block text-[11px] text-muted-foreground whitespace-nowrap">
                        {timeAgo(offer.time_created)}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {filtered.length === 0 && !loading && (
                <div className="py-16 text-center text-muted-foreground text-sm">
                  No offers found. Try adjusting your filters.
                </div>
              )}
            </motion.div>
          )}

          {hasMore && (
            <div className="mt-6 text-center">
              <button onClick={() => setPage(p => p + 1)} disabled={loading}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg shadow-primary/20">
                {loading ? "Loading..." : `Load More (${totalCount - offers.length} remaining)`}
              </button>
            </div>
          )}
        </div>
      </div>

      <OfferDetailModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
      <Footer />
    </div>
  );
}