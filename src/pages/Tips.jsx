import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const tips = [
  {
    number: 1,
    title: "Start with High-Paying Sites",
    text: "Focus on sites with 80%+ rates like Earnlab, CashinStyle, and GemsLoot. These offer the best return for your time.",
  },
  {
    number: 2,
    title: "Game Offers Pay Well",
    text: "Mobile game offers often pay $5–$50+. Look for games that require reaching a specific level — these usually have the best payouts.",
  },
  {
    number: 3,
    title: "Check for Bonuses",
    text: "Many sites offer special holiday bonuses, streak rewards, and seasonal promotions. Log in daily to maximize your earnings!",
  },
  {
    number: 4,
    title: "Compare Offerwalls",
    text: "The same offer can pay differently on different sites. Use our Sites page to find which site pays the most for each offer.",
  },
  {
    number: 5,
    title: "Use a Dedicated Email",
    text: "Create a separate email for GPT sites to keep your inbox organized and avoid missing important reward notifications.",
  },
  {
    number: 6,
    title: "Avoid VPNs",
    text: "Most sites will ban accounts using VPNs. Always complete offers from your real location to avoid losing your earnings.",
  },
  {
    number: 7,
    title: "Screenshot Everything",
    text: "Always take screenshots of completed offers. This helps when submitting support tickets for missing credits.",
  },
  {
    number: 8,
    title: "Focus on One Offer at a Time",
    text: "Complete one offer fully before starting another. This helps avoid confusion and ensures you get credited properly.",
  },
];

export default function Tips() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <a href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </a>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            Pro Tips
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Tips & Tricks</h1>
          <p className="text-muted-foreground max-w-xl">
            Proven strategies to maximize your GPT earnings and avoid common mistakes.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip, i) => (
            <motion.div
              key={tip.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-border/40 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {tip.number}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 p-5 rounded-2xl bg-primary/10 border border-primary/20 text-center"
        >
          <p className="text-sm text-foreground font-medium mb-2">Want more tips and exclusive strategies?</p>
          <a href="https://discord.gg/MTAWAsKDQu" target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              Join our Discord
            </Button>
          </a>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}