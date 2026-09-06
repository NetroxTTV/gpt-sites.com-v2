import React from "react";
import Hero from "@/components/home/Hero";
import HowItWorks, { LogoMarquee } from "@/components/home/HowItWorks";
import FeaturedSites from "@/components/home/FeaturedSites";
import { LiveTeaser, EventsTeaser, GuidesTeaser, FaqTeaser, CtaBanner } from "@/components/home/HomeSections";

const Home = () => (
  <main data-testid="home-page">
    <Hero />
    <LogoMarquee />
    <HowItWorks />
    <FeaturedSites />
    <LiveTeaser />
    <EventsTeaser />
    <GuidesTeaser />
    <FaqTeaser />
    <CtaBanner />
  </main>
);

export default Home;
