import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FeaturedSiteCard from "./FeaturedSiteCard";
import SiteCard from "./SiteCard";
import { featuredSites, otherSites } from "@/lib/sitesData";

export default function SitesSection() {
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");

  const filteredSites = otherSites.filter(site =>
    site.name.toLowerCase().includes(search.toLowerCase()) ||
    (site.description && site.description.toLowerCase().includes(search.toLowerCase()))
  );

  const displayedSites = showAll ? filteredSites : filteredSites.slice(0, 12);

  return (
    <section id="sites" className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Featured Sites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            Top Rated
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Featured Sites
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
          {featuredSites.map((site, i) => (
            <FeaturedSiteCard key={site.name} site={site} index={i} />
          ))}
        </div>

        {/* All Sites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                All Sites
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {otherSites.length} sites available
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowAll(true); }}
                className="pl-10 bg-card border-border/50 focus:border-primary/50"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedSites.map((site, i) => (
            <SiteCard key={site.name} site={site} index={i} />
          ))}
        </div>

        {!showAll && filteredSites.length > 12 && (
          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
              className="rounded-xl gap-2 border-border/50 hover:bg-secondary/50 px-8"
            >
              Show All Sites ({filteredSites.length})
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}

        {filteredSites.length === 0 && search && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sites found matching "{search}"</p>
          </div>
        )}
      </div>
    </section>
  );
}