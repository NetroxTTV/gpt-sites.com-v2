import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Monitor, Smartphone, Globe } from "lucide-react";
import { allSites } from "@/lib/sitesData";

// Map offerwall names to our sites list
const offerwallToSites = {
  adtowall: allSites,
};

export default function OfferDetailModal({ offer, onClose }) {
  if (!offer) return null;

  const countries = (offer.countries || []).filter(c => c.targeting_type === "include");

  return (
    <AnimatePresence>
      {offer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-border/30">
                <div className="flex items-center gap-3">
                  {offer.thumbnail_url ? (
                    <img src={offer.thumbnail_url} alt={offer.name} className="w-12 h-12 rounded-xl object-cover bg-secondary" onError={e => e.target.style.display = 'none'} />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center text-lg font-bold text-primary">{offer.name[0]}</div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{offer.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded">{offer.category}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${offer.status === "active" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-muted text-muted-foreground"}`}>
                        {offer.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Payout */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <span className="text-sm text-muted-foreground font-medium">Payout</span>
                  <span className="text-2xl font-extrabold text-green-400">${offer.payout.toFixed(2)}</span>
                </div>

                {/* Countries */}
                {countries.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Available Countries</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {countries.map(c => (
                        <span key={c.country_code} className="px-2 py-1 rounded-lg text-xs font-medium bg-secondary/60 text-foreground border border-border/30">
                          {c.label} ({c.country_code})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {offer.description && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: offer.description }} />
                  </div>
                )}

                {/* Where to find (AdToWall sites) */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Find This Offer On</h3>
                  <p className="text-xs text-muted-foreground mb-3">This offer is available on the <span className="text-primary font-semibold">AdToWall</span> offerwall. Complete it through any of these sites for the best payout rates:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {allSites.filter(s => s.offerwalls?.includes("adtowall")).map(site => (
                      <a
                        key={site.name}
                        href={site.visit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-primary/10 border border-border/30 hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          {site.logo_url && <img src={site.logo_url} alt={site.name} className="w-7 h-7 rounded-md object-contain" />}
                          <div>
                            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{site.name}</p>
                            <p className="text-xs text-muted-foreground">{site.description}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                {offer.tracking_url && (
                  <a
                    href={offer.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    View Offer <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}