import React from "react";
import { ExternalLink, Star, Smartphone, Flame, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const badgeConfig = {
  new: { label: "New", icon: Zap, className: "bg-green-500/15 text-green-400 border-green-500/20" },
  popular: { label: "Popular", icon: Flame, className: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  mobile_app: { label: "Mobile App", icon: Smartphone, className: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
};

export default function SiteCard({ site, index, showRate = false }) {
  const badge = site.badge && site.badge !== "none" ? badgeConfig[site.badge] : null;
  const BadgeIcon = badge?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
    >
      <a
        href={site.visit_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        <div className="relative h-full rounded-xl bg-card border border-border/40 p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-3 min-h-[24px]">
            {badge && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.className}`}>
                <BadgeIcon className="w-3 h-3" />
                {badge.label}
              </span>
            )}
            {site.bonus_tag && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-accent/15 text-accent border border-accent/20">
                {site.bonus_tag}
              </span>
            )}
          </div>

          {/* Logo + Name */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-lg bg-secondary/60 flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/30">
              {site.logo_url ? (
                <img src={site.logo_url} alt={site.name} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-base font-bold text-primary">{site.name?.[0]}</span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {site.name}
              </h3>
              {site.description && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {site.description}
                </p>
              )}
            </div>
          </div>

          {/* Rating + Visit */}
          <div className="flex items-center justify-between">
            {showRate && site.rates ? (
              <span className="text-sm font-bold text-green-400">{site.rates}%</span>
            ) : (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < (site.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
              Visit
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </a>
    </motion.div>
  );
}