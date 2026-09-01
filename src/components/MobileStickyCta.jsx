import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredSites } from "@/lib/sitesData";

const topSite = featuredSites[0];

export default function MobileStickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!topSite) return null;
  const visible = pastHero && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden pb-[env(safe-area-inset-bottom)]"
        >
          <div className="flex items-center gap-3 mx-3 mb-3 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl px-3 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
            <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground leading-tight">Top pick</p>
              <p className="text-sm font-bold text-foreground leading-tight truncate">{topSite.name}</p>
            </div>
            <a href={topSite.visit_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
              <Button size="sm" className="gap-1.5 rounded-lg font-semibold shadow-md shadow-primary/20">
                Visit
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="flex-shrink-0 p-1.5 -mr-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
