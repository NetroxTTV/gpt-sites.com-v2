import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Hero } from "@/components/ui/animated-hero";
import SitesSection from "@/components/SitesSection";
import FeaturedSiteCard from "@/components/FeaturedSiteCard";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { featuredSites } from "@/lib/sitesData";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/reveal";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <Hero />
      <section id="quick-picks" className="py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
                Quick Picks
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Top sites to start earning fast</h2>
              <p className="text-sm text-muted-foreground max-w-xl mt-2">
                Highest rates, fast payouts, and easy onboarding. Pick one and start with their strongest offerwalls.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/Sites">
                <Button className="rounded-lg">Browse Sites</Button>
              </Link>
              <a href="https://discord.gg/gptfr" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="rounded-lg border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
                  Join Discord
                </Button>
              </a>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSites.slice(0, 3).map((site, index) => (
              <FeaturedSiteCard key={site.name} site={site} index={index} />
            ))}
          </div>

          <StaggerContainer className="mt-10 grid gap-4 md:grid-cols-3">
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
              <StaggerItem key={step.title}>
                <div className="rounded-2xl border border-border/50 bg-card/70 p-5 shadow-[0_10px_26px_rgba(59,130,246,0.12)]">
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
        </div>
      </section>
      <SitesSection />
      <FaqSection />
      <Footer />
    </div>
  );
}