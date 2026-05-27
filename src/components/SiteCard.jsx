import React from "react";
import { ExternalLink, Star, Smartphone, Flame, Zap, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { getCasinoBonusTagClassName } from "@/lib/bonusTagStyles";

const topBadgeClassName = "bg-gradient-to-r from-sky-400/25 via-cyan-300/25 to-blue-300/25 text-sky-700 border-sky-300/60 shadow-[0_0_14px_rgba(56,189,248,0.24)] animate-pulse";

const badgeConfig = {
  new: { label: "New", icon: Zap, className: "bg-sky-500/15 text-sky-600 border-sky-400/30" },
  popular: { label: "Popular", icon: Flame, className: "bg-amber-400/15 text-amber-600 border-amber-400/30" },
  mobile_app: { label: "Mobile App", icon: Smartphone, className: "bg-indigo-500/15 text-indigo-600 border-indigo-400/30" },
};

export default function SiteCard({ site, index, showRate = false, showBadges = true }) {
  const topRankMatch = /^top(\d+)$/i.exec(site.badge || "");
  const casinoBonusTagClassName = getCasinoBonusTagClassName(site.bonus_tag);
  const badge = topRankMatch
    ? { label: `Top ${topRankMatch[1]}`, icon: Crown, className: topBadgeClassName }
    : site.badge && site.badge !== "none"
      ? badgeConfig[site.badge]
      : null;
  const BadgeIcon = badge?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      className="min-w-0"
    >
      <a
        href={site.visit_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full w-full min-w-0"
      >
        <div className="relative h-full min-w-0 rounded-xl bg-card border border-border/40 p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
          {/* Badges row */}
          {showBadges && (
            <div className="flex items-center gap-2 mb-3 min-h-[24px]">
              {badge && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.className}`}>
                  <BadgeIcon className="w-3 h-3" />
                  {badge.label}
                </span>
              )}
              {site.bonus_tag && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${casinoBonusTagClassName || "bg-accent/20 text-orange-700 border-accent/35"}`}>
                  {site.bonus_tag}
                </span>
              )}
            </div>
          )}

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
              <span className="text-sm font-bold text-primary">{site.rates}%</span>
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