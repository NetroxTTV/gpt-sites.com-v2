import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const events = [
  {
    title: "Earnopolis +30% on Torox",
    siteName: "Earnopolis",
    siteUrl: "https://earnopolis.com/r/?r=netrox",
    dateRange: "May 15 - June 30",
    endDate: "2026-06-30",
    highlight: "Torox payouts run at 110% on Earnopolis during this window.",
    details: [
      "Boost applies to any Torox offer completed on Earnopolis.",
      "Highest effective Torox rate available by a wide margin.",
      "Plan large offers here to maximize ROI.",
    ],
  },
  {
    title: "RewardJoy Torox Tournament",
    siteName: "RewardJoy",
    siteUrl: "https://www.coinpayu.com/?r=Netrox",
    dateRange: "May 15 - May 30",
    endDate: "2026-05-30",
    highlight: "RewardJoy is running a $1000 Torox tournament with boosted competition payouts.",
    details: [
      "RewardJoy is the new name for CoinPayu.",
      "Tournament prize pool: $1000.",
      "Compete by completing Torox offers during the event window.",
    ],
    bannerUrl: "https://www.coinpayu.com/static/images/cooperate/pc.svg",
  },
  {
    title: "GemsLoot RevU $400 Tournament",
    siteName: "GemsLoot",
    siteUrl: "https://gemsloot.com/?aff=netrox",
    dateRange: "Ending in 10 days",
    endDate: "2026-06-01",
    highlight: "GemsLoot is running a $400 RevU tournament for top performers.",
    details: [
      "Prize pool: $400.",
      "Complete RevU offers on GemsLoot to compete.",
    ],
  },
];

const getDaysLeft = (endDate) => {
  if (!endDate) return null;
  const end = new Date(`${endDate}T23:59:59`);
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  if (Number.isNaN(diffMs)) return null;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  return days;
};

const formatCountdown = (daysLeft) => {
  if (daysLeft === null) return null;
  if (daysLeft === 0) return "Ends today";
  if (daysLeft === 1) return "Ends in 1 day";
  return `Ends in ${daysLeft} days`;
};

function EventCard({ event, index, isCompact }) {
  const daysLeft = getDaysLeft(event.endDate);
  const countdown = daysLeft !== null && daysLeft <= 30 ? formatCountdown(daysLeft) : null;

  return (
    <motion.a
      key={event.title}
      href={event.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`block rounded-2xl border border-border/55 bg-card/70 backdrop-blur-sm ${
        isCompact ? "p-5" : "p-6 sm:p-7"
      } shadow-[0_12px_28px_rgba(59,130,246,0.12)] transition-all hover:border-primary/45 hover:shadow-[0_16px_36px_rgba(59,130,246,0.18)]`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Active Event</p>
          <h2 className={`${isCompact ? "text-lg" : "text-xl sm:text-2xl"} font-extrabold text-foreground`}>
            {event.title}
          </h2>
          <span className="text-sm font-semibold text-primary">
            {event.siteName}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25">
            {event.dateRange}
          </span>
          {countdown && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/25">
              {countdown}
            </span>
          )}
        </div>
      </div>

      {event.bannerUrl && (
        <div className="mb-4 rounded-xl border border-border/50 bg-background/70 overflow-hidden">
          <img
            src={event.bannerUrl}
            alt={`${event.title} banner`}
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>
      )}

      <p className={`text-sm ${isCompact ? "sm:text-sm" : "sm:text-base"} text-foreground font-semibold mb-4`}>
        {event.highlight}
      </p>

      <ul className="space-y-2 text-sm text-muted-foreground">
        {event.details.map((detail) => (
          <li key={detail} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </motion.a>
  );
}

export default function Events() {
  const [search, setSearch] = useState("");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return events;
    return events.filter((event) =>
      [event.siteName, event.title].some((value) => String(value).toLowerCase().includes(query))
    );
  }, [search]);

  const mainEvents = filteredEvents.slice(0, 2);
  const otherEvents = filteredEvents.slice(2);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              <span className="bg-gradient-to-r from-primary via-sky-500 to-accent bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Current offerwall boosts, tournaments, and seasonal promos across GPT sites.
            </p>
          </motion.div>

          <div className="mb-8 rounded-2xl border border-border/55 bg-card/70 backdrop-blur-sm p-5 shadow-[0_12px_28px_rgba(59,130,246,0.14)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Plan your week around boosts</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Events are limited-time. Pair them with the best rate sites to maximize payouts.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/Sites">
                  <Button size="sm" className="rounded-lg">Find best rates</Button>
                </Link>
                <Link to="/Guides">
                  <Button size="sm" variant="outline" className="rounded-lg border-primary/30 text-primary hover:bg-primary/10">
                    Find a guide
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="events-search">
              Search by site name
            </label>
            <input
              id="events-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Type a site name..."
              className="w-full rounded-xl border border-border/55 bg-card/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </div>

          <div className="space-y-5">
            {mainEvents.map((event, index) => (
              <EventCard key={event.title} event={event} index={index} isCompact={false} />
            ))}
          </div>

          {otherEvents.length > 0 && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {otherEvents.map((event, index) => (
                <EventCard key={event.title} event={event} index={index} isCompact />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
