import React from "react";
import { Globe2, Layers3, ShieldCheck, MessagesSquare } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/reveal";
import { allSites, allOfferwalls } from "@/lib/sitesData";

const stats = [
  {
    icon: Globe2,
    value: `${allSites.length}+`,
    label: "GPT sites tracked",
  },
  {
    icon: Layers3,
    value: `${allOfferwalls.length}+`,
    label: "Offerwalls compared",
  },
  {
    icon: ShieldCheck,
    value: "100% Free",
    label: "No signup fees, ever",
  },
  {
    icon: MessagesSquare,
    value: "Active",
    label: "Discord community",
  },
];

export default function TrustBar() {
  return (
    <section className="relative z-10 px-4 sm:px-6 pb-6 md:pb-8">
      <StaggerContainer className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 rounded-2xl border border-border/50 bg-card/70 backdrop-blur-xl p-4 sm:p-6 shadow-[0_12px_32px_rgba(59,130,246,0.1)]">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.label} className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-extrabold text-foreground leading-tight truncate">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
