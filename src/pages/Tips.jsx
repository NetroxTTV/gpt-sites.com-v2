import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "framer-motion";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";

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
    text: "Many sites offer special holiday bonuses, streak rewards, and seasonal promotions. Log in daily to maximize your earnings.",
  },
  {
    number: 4,
    title: "Compare Offerwalls",
    text: "The same offer can pay differently on different sites. Use our Sites page to find which site pays the most for each offer.",
  },
  {
    number: 5,
    title: "Use Guides First",
    text: "Check Guides before starting an offer so you avoid common mistakes and finish faster.",
  },
  {
    number: 6,
    title: "Check Rates Before You Start",
    text: "Use the Sites page to compare rates so you always pick the highest paying site.",
  },
  {
    number: 7,
    title: "Use a Dedicated Email",
    text: "Create a separate email for GPT sites to keep your inbox organized and avoid missing important reward notifications.",
  },
  {
    number: 8,
    title: "Avoid VPNs",
    text: "Most sites will ban accounts using VPNs. Always complete offers from your real location to avoid losing your earnings.",
  },
  {
    number: 9,
    title: "Screenshot Everything",
    text: "Always take screenshots of completed offers. This helps when submitting support tickets for missing credits.",
  },
  {
    number: 10,
    title: "Focus on One Offer at a Time",
    text: "Complete one offer fully before starting another. This helps avoid confusion and ensures you get credited properly.",
  },
  {
    number: 11,
    title: "Check Offers Quickly",
    text: "If you want to check for offers, use this site:",
    link: {
      label: "gpthub.gg/offers",
      href: "https://gpthub.gg/offers",
    },
  },
];

export default function Tips() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <Reveal className="mb-10 rounded-2xl border border-border/50 bg-card/65 backdrop-blur-sm p-5 sm:p-6 shadow-[0_14px_34px_rgba(59,130,246,0.12)]">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 mb-4">
            Pro Tips
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            <span className="bg-gradient-to-r from-primary via-sky-500 to-accent bg-clip-text text-transparent">Tips &amp; Tricks</span>
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Proven strategies to maximize your GPT earnings and avoid common mistakes.
          </p>
        </Reveal>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip) => (
            <StaggerItem key={tip.number}>
              <div className="h-full bg-card/85 border border-border/45 rounded-2xl p-5 hover:border-primary/35 hover:shadow-[0_10px_26px_rgba(59,130,246,0.14)] transition-all duration-300">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/25 to-accent/25 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0 border border-primary/25">
                    {tip.number}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.text}
                      {tip.link && (
                        <a
                          href={tip.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium ml-1"
                        >
                          {tip.link.label}
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal delay={0.1} className="mt-10 rounded-2xl border border-border/55 bg-card/70 backdrop-blur-sm p-5 shadow-[0_12px_28px_rgba(59,130,246,0.12)]">
          <h2 className="text-lg font-bold text-foreground mb-2">Ready to apply these tips?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Pick a top site and follow a guide so you complete your first high-paying offer faster.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/Sites">
              <Button size="sm" className="rounded-lg">Browse sites</Button>
            </Link>
            <Link to="/Guides">
              <Button size="sm" variant="outline" className="rounded-lg border-primary/30 text-primary hover:bg-primary/10">
                Open guides
              </Button>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-indigo-400/5 to-indigo-500/10 border border-indigo-500/20 text-center shadow-[0_12px_30px_rgba(99,102,241,0.12)]">
          <p className="text-sm text-foreground font-medium mb-3">Want more tips and exclusive strategies?</p>
          <a href="https://discord.gg/gptfr" target="_blank" rel="noopener noreferrer">
            <Button className="gap-2 bg-indigo-500 hover:bg-indigo-600 text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/></svg>
              Join our Discord
            </Button>
          </a>
        </Reveal>
      </div>
      <Footer />
    </div>
  );
}
