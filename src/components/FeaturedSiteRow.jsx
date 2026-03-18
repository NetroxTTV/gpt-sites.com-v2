import React from "react";
import { ExternalLink, Check, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { getCasinoBonusTagClassName } from "@/lib/bonusTagStyles";

const rankColors = {
  1: "from-yellow-400 to-amber-500",
  2: "from-slate-300 to-slate-400",
  3: "from-amber-600 to-amber-700",
  4: "from-primary to-accent",
  5: "from-emerald-500 to-teal-500",
};

const rewardIcons = {
  PayPal: { label: "P", bg: "bg-blue-600" },
  Bitcoin: { label: "B", bg: "bg-orange-500" },
  Litecoin: { label: "L", bg: "bg-gray-500" },
  Amazon: { label: "A", bg: "bg-yellow-600" },
  "Gift Cards": { label: "G", bg: "bg-green-600" },
};

export default function FeaturedSiteRow({ site, index }) {
  const rank = site.rank || index + 1;
  const casinoBonusTagClassName = getCasinoBonusTagClassName(site.bonus_tag);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className="relative rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all duration-300 overflow-hidden group">
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-all duration-500 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-stretch">
          {/* Logo area */}
          <div className="flex flex-col items-center justify-center p-8 md:w-52 md:border-r border-border/30 bg-secondary/20 flex-shrink-0">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-gradient-to-r ${rankColors[rank]} text-white shadow-lg mb-4`}>
              #{rank} Featured
            </span>

            <div className="w-20 h-20 rounded-2xl bg-background flex items-center justify-center overflow-hidden border border-border/40 mb-4">
              {site.logo_url ? (
                <img src={site.logo_url} alt={site.name} className="w-14 h-14 object-contain" />
              ) : (
                <span className="text-2xl font-bold text-primary">{site.name[0]}</span>
              )}
            </div>

            <div className="flex gap-0.5 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < site.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`} />
              ))}
            </div>

            {site.bonus_tag && (
              <span className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${casinoBonusTagClassName || "bg-accent/20 text-accent border-accent/30"}`}>
                {site.bonus_tag}
              </span>
            )}
          </div>

          {/* Middle info */}
          <div className="flex-1 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{site.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{site.tagline}</p>
            </div>

            {/* Rewards */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Rewards</p>
              <div className="flex items-center gap-2">
                {site.rewards?.map((r) => {
                  const icon = rewardIcons[r];
                  return icon ? (
                    <div key={r} title={r} className={`w-7 h-7 rounded-lg ${icon.bg} flex items-center justify-center text-white text-xs font-bold`}>
                      {icon.label}
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {site.features?.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Right details + CTA */}
          <div className="flex flex-col justify-between p-6 md:w-56 md:border-l border-border/30 flex-shrink-0 bg-secondary/10">
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4 text-primary/70 flex-shrink-0" />
                <span>Time to pay: <span className="text-foreground font-medium">{site.details?.pay_time}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4 text-primary/70 flex-shrink-0" />
                <span>Min. withdraw: <span className="text-foreground font-medium">{site.details?.min_withdraw}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="w-4 h-4 text-primary/70 flex-shrink-0" />
                <span>Min. age: <span className="text-foreground font-medium">{site.details?.min_age}</span></span>
              </div>
            </div>

            <a href={site.visit_url} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20">
                Visit Website
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
