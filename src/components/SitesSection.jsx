import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FeaturedSiteRow from "./FeaturedSiteRow";
import { featuredSites } from "@/lib/sitesData";

export default function SitesSection() {
  return (
    <section id="sites" className="py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            Top Rated
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Featured GPT Sites
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Hand-picked sites with the best payout rates, fastest cashouts, and exclusive bonuses.
          </p>
        </motion.div>

        {/* Featured rows */}
        <div className="space-y-4 mb-12">
          {featuredSites.map((site, i) => (
            <FeaturedSiteRow key={site.name} site={site} index={i} />
          ))}
        </div>

        {/* More Sites CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center gap-3">
            <p className="text-muted-foreground text-sm">
              Looking for more options? Browse all 45+ GPT sites.
            </p>
            <Link to="/Sites">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary px-8 font-semibold"
              >
                More Sites
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}