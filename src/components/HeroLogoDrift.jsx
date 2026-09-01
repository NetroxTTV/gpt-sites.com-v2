import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { allSites } from "@/lib/sitesData";

const FEATURED_NAMES = [
  "Earnlab",
  "GemsLoot",
  "Earnopolis",
  "MoonMiles",
  "PrizeBear",
  "CashTask",
  "FreeCash",
  "Timebucks",
  "GameHag",
  "Freeward",
  "EarnLoop",
  "RBXFast",
];

// Two side gutters, away from the viewport edge and away from the centered hero text.
const HORIZONTAL_BANDS = [
  [7, 27],
  [73, 93],
];

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

export function HeroLogoDrift() {
  const logos = useMemo(
    () =>
      FEATURED_NAMES.map((name) => allSites.find((site) => site.name === name))
        .filter(Boolean)
        .map((site) => {
          const [bandMin, bandMax] = HORIZONTAL_BANDS[Math.floor(Math.random() * HORIZONTAL_BANDS.length)];
          return {
            site,
            rotate: Math.random() * 90 - 45,
            top: `${randomInRange(8, 88)}%`,
            left: `${randomInRange(bandMin, bandMax)}%`,
          };
        }),
    []
  );

  return (
    <div className="absolute inset-0 hidden sm:block overflow-hidden pointer-events-none" aria-hidden="true">
      {logos.map(({ site, rotate, top, left }, i) => {
        return (
          <motion.img
            key={site.name}
            src={site.logo_url}
            alt=""
            className="absolute w-8 h-8 sm:w-9 sm:h-9 object-contain"
            style={{ top, left, rotate }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              repeatDelay: 1 + (i % 3),
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
