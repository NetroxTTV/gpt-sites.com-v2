import React from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-[74vh] md:min-h-[82vh] flex items-start md:items-center justify-center overflow-hidden pt-16 md:pt-12">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/16 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[15%] right-[10%] w-[340px] h-[340px] bg-sky-200/40 rounded-full blur-[90px] pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--primary) / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.15) 1px, transparent 1px)',
        backgroundSize: '56px 56px'
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-3 md:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 shadow-sm shadow-primary/10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Your #1 GPT Resource</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            <span className="text-foreground">Best </span>
            <span className="bg-gradient-to-r from-primary via-sky-500 to-accent bg-clip-text text-transparent">
              Get Paid To
            </span>
            <br />
            <span className="text-foreground">Sites</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Discover the best GPT Sites, Tips and Guides to maximize your earnings. Complete surveys, watch videos, and do tasks to earn real cash, crypto and gift cards.
          </p>

          <p className="text-sm text-muted-foreground/70 mb-10">
            Check out our <a href="/Guides" className="text-primary hover:underline font-medium">Guides</a> page for best offers,
            or visit our <a href="/Tips" className="text-primary hover:underline font-medium">Tips</a> & FAQ pages.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#quick-picks" onClick={(e) => { e.preventDefault(); document.getElementById('quick-picks')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20">
                Quick Picks
                <ArrowDown className="w-4 h-4" />
              </Button>
            </a>
            <a href="#sites" onClick={(e) => { e.preventDefault(); document.getElementById('sites')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20">
                Browse Sites
                <ArrowDown className="w-4 h-4" />
              </Button>
            </a>
            <a href="https://discord.gg/gptfr" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base font-semibold rounded-xl border-border/50 hover:bg-secondary/50 gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                </svg>
                Join Discord
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Sponsored banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16"
        >
          <a href="https://rewardflow.me/?ref=NETROX" target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative rounded-2xl overflow-hidden border border-border/40 hover:border-primary/35 transition-all duration-300 max-w-xl mx-auto group shadow-[0_8px_28px_rgba(59,130,246,0.12)]">
              <img
                src={new URL("../imgs/Sites/rewardflow_banner.png", import.meta.url).href}
                alt="RewardFlow - Get Paid To Play Games"
                className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </a>
          <p className="text-xs text-muted-foreground/50 mt-2">Sponsored</p>
        </motion.div>
      </div>
    </section>
  );
}