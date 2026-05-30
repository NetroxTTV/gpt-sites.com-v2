import React from "react";
import { ExternalLink, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "framer-motion";
import { getCasinoBonusTagClassName } from "@/lib/bonusTagStyles";

const rankColors = {
  1: "from-yellow-400 to-amber-500",
  2: "from-gray-300 to-gray-400",
  3: "from-amber-600 to-amber-700",
  4: "from-primary to-accent",
};

const rankBgGlow = {
  1: "shadow-yellow-500/20",
  2: "shadow-gray-400/10",
  3: "shadow-amber-600/15",
  4: "shadow-primary/15",
};

export default function FeaturedSiteCard({ site, index }) {
  const rank = site.rank || index + 1;
  const casinoBonusTagClassName = getCasinoBonusTagClassName(site.bonus_tag);
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.52, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={site.visit_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        <div className={`relative h-full rounded-2xl bg-card border border-border/50 p-6 hover:border-primary/40 transition-all duration-500 hover:shadow-xl ${rankBgGlow[rank]} overflow-hidden`}>
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-all" />
          
          {/* Rank badge */}
          <div className={`absolute top-4 left-4 w-8 h-8 rounded-lg bg-gradient-to-br ${rankColors[rank]} flex items-center justify-center shadow-lg`}>
            <span className="text-sm font-bold text-white">#{rank}</span>
          </div>

          <div className="flex h-full flex-col items-center text-center pt-6">
            {/* Logo */}
            <div className="w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center mb-4 overflow-hidden border border-border/30">
              {site.logo_url ? (
                <img src={site.logo_url} alt={site.name} className="w-12 h-12 object-contain" />
              ) : (
                <Trophy className="w-6 h-6 text-primary" />
              )}
            </div>

            <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {site.name}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
              {site.description || site.tagline}
            </p>

            {site.bonus_tag && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border mb-3 ${casinoBonusTagClassName || "bg-accent/15 text-accent border-accent/20"}`}>
                {site.bonus_tag}
              </span>
            )}

            <Button size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl gap-2 font-semibold">
              Visit Site
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </a>
    </motion.div>
  );
}