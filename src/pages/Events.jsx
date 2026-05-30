import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getAliasTokens } from "@/lib/siteAliases";
import { Clock, Flame, CheckCircle } from "lucide-react";
import { events, getDaysLeft } from "@/lib/eventsData";

const getTimeProgress = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T23:59:59`).getTime();
  const now = Date.now();
  const total = end - start;
  if (total <= 0) return 100;
  return Math.max(0, Math.min(100, ((now - start) / total) * 100));
};

const getUrgency = (daysLeft) => {
  if (daysLeft === null) return null;
  if (daysLeft <= 2) return { label: "Ending very soon", color: "text-red-400", bar: "bg-red-500", badge: "bg-red-500/15 text-red-400 border-red-500/25" };
  if (daysLeft <= 7) return { label: "Last chance", color: "text-amber-400", bar: "bg-amber-400", badge: "bg-amber-400/15 text-amber-400 border-amber-400/25" };
  return { label: "Active", color: "text-emerald-400", bar: "bg-emerald-500", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" };
};

const formatCountdown = (daysLeft) => {
  if (daysLeft === null) return null;
  if (daysLeft === 0) return "Ends today";
  if (daysLeft === 1) return "1 day left";
  return `${daysLeft} days left`;
};

// ─── EventCard ────────────────────────────────────────────────────────────────

function EventCard({ event, index, isCompact }) {
  const reduce = useReducedMotion();
  const daysLeft = getDaysLeft(event.endDate);
  const progress = getTimeProgress(event.startDate, event.endDate);
  const urgency = getUrgency(daysLeft);
  const countdown = daysLeft !== null && daysLeft <= 30 ? formatCountdown(daysLeft) : null;
  const timeRemaining = progress !== null ? 100 - progress : null;

  const barColor = urgency?.bar ?? "bg-primary";

  return (
    <motion.a
      href={event.siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`block rounded-2xl border border-border/55 bg-card/70 backdrop-blur-sm overflow-hidden ${
        isCompact ? "p-5" : "p-6 sm:p-7"
      } shadow-[0_12px_28px_rgba(59,130,246,0.12)] transition-all hover:border-primary/45 hover:shadow-[0_16px_36px_rgba(59,130,246,0.18)] cursor-pointer`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Active Event</p>
          <h2 className={`${isCompact ? "text-lg" : "text-xl sm:text-2xl"} font-extrabold text-foreground leading-tight`}>
            {event.title}
          </h2>
          <span className="text-sm font-semibold text-primary">{event.siteName}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:justify-end flex-shrink-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25">
            {event.dateRange}
          </span>
          {countdown && urgency && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${urgency.badge}`}>
              <Clock className="w-3 h-3" />
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
            className="w-full h-28 sm:h-32 object-contain"
            loading="lazy"
          />
        </div>
      )}

      <p className={`text-sm ${isCompact ? "" : "sm:text-base"} text-foreground font-semibold mb-3`}>
        {event.highlight}
      </p>

      <ul className="space-y-1.5 text-sm text-muted-foreground mb-5">
        {event.details.map((detail) => (
          <li key={detail} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            {detail}
          </li>
        ))}
      </ul>

      {/* Urgency progress bar */}
      {timeRemaining !== null && (
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-medium ${urgency?.color ?? "text-muted-foreground"}`}>
              {urgency?.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(timeRemaining)}% remaining
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-border/40 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${barColor}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${timeRemaining}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: index * 0.07 + 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      )}
    </motion.a>
  );
}

// ─── Expired card (compact, muted) ────────────────────────────────────────────

function ExpiredEventCard({ event }) {
  return (
    <div className="rounded-xl border border-border/30 bg-card/40 p-4 opacity-50">
      <div className="flex items-center gap-2 mb-1">
        <CheckCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <h3 className="text-sm font-semibold text-muted-foreground truncate">{event.title}</h3>
      </div>
      <p className="text-xs text-muted-foreground/70 ml-5">{event.siteName} · {event.dateRange}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Events() {
  const [search, setSearch] = useState("");

  const { active: activeEvents, expired: expiredEvents } = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matched = query
      ? events.filter((e) => getAliasTokens([e.siteName, e.title]).some((t) => t.includes(query)))
      : events;

    const active = matched
      .filter((e) => getDaysLeft(e.endDate) !== null)
      .sort((a, b) => {
        const aIsEarnopolis = a.siteName === "Earnopolis";
        const bIsEarnopolis = b.siteName === "Earnopolis";
        if (aIsEarnopolis && !bIsEarnopolis) return -1;
        if (!aIsEarnopolis && bIsEarnopolis) return 1;
        return (getDaysLeft(a.endDate) ?? 999) - (getDaysLeft(b.endDate) ?? 999);
      });

    const expired = matched.filter((e) => getDaysLeft(e.endDate) === null);

    return { active, expired };
  }, [search]);

  const mainEvents = activeEvents.slice(0, 2);
  const otherEvents = activeEvents.slice(2);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold">
                <span className="bg-gradient-to-r from-primary via-sky-500 to-accent bg-clip-text text-transparent">
                  Events
                </span>
              </h1>
              {activeEvents.length > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/25">
                  {activeEvents.length} active
                </span>
              )}
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Current offerwall boosts, tournaments, and seasonal promos across GPT sites — sorted by urgency.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 rounded-2xl border border-border/55 bg-card/70 backdrop-blur-sm p-5 shadow-[0_12px_28px_rgba(59,130,246,0.14)]"
          >
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
          </motion.div>

          {/* Search */}
          <div className="mb-8 rounded-2xl border border-border/55 bg-card/80 backdrop-blur-xl p-3 sm:p-4 shadow-[0_12px_28px_rgba(59,130,246,0.12)]">
            <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="events-search">
              Search by site or event name
            </label>
            <input
              id="events-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a site or event name..."
              className="w-full rounded-xl border border-border/55 bg-background/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Active events — empty state */}
          {activeEvents.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border/40 bg-card/30">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-4">
                <Flame className="w-5 h-5 text-primary/50" />
              </div>
              {search ? (
                <>
                  <p className="text-foreground font-semibold mb-1">No events match &ldquo;{search}&rdquo;</p>
                  <p className="text-muted-foreground text-sm mb-4">Try a different site name or clear the search.</p>
                  <button onClick={() => setSearch("")} className="text-sm text-primary hover:underline font-medium">
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p className="text-foreground font-semibold mb-1">No active events right now</p>
                  <p className="text-muted-foreground text-sm mb-5 max-w-xs mx-auto">
                    New events are posted on Discord first — join to get notified as soon as they drop.
                  </p>
                  <a
                    href="https://discord.gg/gptfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-sm font-semibold hover:bg-indigo-500/20 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/></svg>
                    Join Discord for event alerts
                  </a>
                </>
              )}
            </div>
          )}

          {mainEvents.length > 0 && (
            <div className="space-y-5">
              {mainEvents.map((event, index) => (
                <EventCard key={event.title} event={event} index={index} isCompact={false} />
              ))}
            </div>
          )}

          {otherEvents.length > 0 && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {otherEvents.map((event, index) => (
                <EventCard key={event.title} event={event} index={index + 2} isCompact />
              ))}
            </div>
          )}

          {/* Expired events */}
          {expiredEvents.length > 0 && (
            <div className="mt-10">
              <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-semibold mb-3">
                Recently ended
              </p>
              <div className="space-y-2">
                {expiredEvents.map((event) => (
                  <ExpiredEventCard key={event.title} event={event} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
