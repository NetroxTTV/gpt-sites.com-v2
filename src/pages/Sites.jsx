import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteCard from "@/components/SiteCard";
import { otherSites } from "@/lib/sitesData";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const filters = ["All", "New", "Popular", "Mobile App"];
const filterMap = { "All": null, "New": "new", "Popular": "popular", "Mobile App": "mobile_app" };

export default function Sites() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = otherSites.filter(site => {
    const matchesSearch =
      site.name.toLowerCase().includes(search.toLowerCase()) ||
      (site.description && site.description.toLowerCase().includes(search.toLowerCase()));
    const badgeFilter = filterMap[activeFilter];
    const matchesBadge = !badgeFilter || site.badge === badgeFilter;
    return matchesSearch && matchesBadge;
  });

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <Link to="/Home">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
              All GPT Sites
            </h1>
            <p className="text-muted-foreground">
              {otherSites.length} sites — find the best one for you
            </p>
          </motion.div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border/50 focus:border-primary/50"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === f
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((site, i) => (
                <SiteCard key={site.name} site={site} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No sites found matching your search.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}