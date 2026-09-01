import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Hero } from "@/components/ui/animated-hero";
import TrustBar from "@/components/TrustBar";
import SitesSection from "@/components/SitesSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import MobileStickyCta from "@/components/MobileStickyCta";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";
import { ArrowDown } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <Hero />
      <TrustBar />
      
      <div id="how-it-works"></div>

      <section className="py-24 px-6 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Start earning in 3 simple steps</h2>
            <p className="text-sm text-muted-foreground max-w-xl mt-2">
              No experience needed. Pick a site, find the right offer, and time it right to maximize your payout.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4 items-stretch">
            <StaggerContainer className="flex flex-col gap-4">
              {[
                {
                  title: "1. Pick a site",
                  text: "Choose a top-rated site with the best rates for your favorite offerwalls.",
                  cta: "Browse sites",
                  to: "/Sites",
                },
                {
                  title: "2. Find the right offer",
                  text: "Use guides to pick high-paying, low-friction offers you can finish fast.",
                  cta: "Explore guides",
                  to: "/Guides",
                },
                {
                  title: "3. Time the boosts",
                  text: "Check events and tournaments so you finish offers when payouts are higher.",
                  cta: "See events",
                  to: "/Events",
                },
              ].map((step) => (
                <StaggerItem key={step.title} className="flex-1">
                  <div className="h-full rounded-2xl border border-border/50 bg-card/70 p-5 shadow-[0_10px_26px_rgba(59,130,246,0.12)]">
                    <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{step.text}</p>
                    <Link to={step.to}>
                      <Button size="sm" className="rounded-lg">
                        {step.cta}
                      </Button>
                    </Link>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <Reveal
              delay={0.15}
              className="relative hidden md:flex min-h-[220px] items-center justify-center p-4 ml-24"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-primary/20 rounded-full blur-[110px] pointer-events-none" />
              <img
                src={new URL("../icon.png", import.meta.url).href}
                alt="GPT Sites"
                className="relative w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[24rem] lg:h-[24rem] object-contain drop-shadow-[0_20px_40px_rgba(59,130,246,0.35)]"
              />
            </Reveal>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() =>
              document.getElementById("featured-sites")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="w-full gap-2 rounded-xl px-9 py-5 sm:py-6 text-base font-semibold border-border/60 bg-card/60 hover:bg-secondary hover:border-primary/40 hover:text-foreground sm:w-auto"
          >
            Featured Sites <ArrowDown className="w-4 h-4" />
          </Button>
        </div>
      </section>
      
      <div id="featured-sites" />
      <SitesSection />
      <FaqSection />
      <Footer />
      <ScrollToTop />
      <MobileStickyCta />
    </div>
  );
}