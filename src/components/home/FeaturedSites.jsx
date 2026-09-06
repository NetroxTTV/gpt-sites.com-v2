import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import { Reveal, SectionHeader, SiteLogo, Stars, BonusBadge, rateTone } from "@/components/shared/Primitives";
import { getFeaturedSites } from "@/data/mock";
import { cn } from "@/lib/utils";

const rateLabel = (rates) => {
  if (!rates) return null;
  if (rates.min === rates.max) return `${rates.max}%`;
  return `${rates.min}-${rates.max}%`;
};

const CompactCard = ({ site, index }) => {
  const { t } = useLang();
  const first = index === 0;
  return (
    <Reveal delay={index * 70} className="h-full">
      <a
        href={site.url}
        target="_blank"
        rel="noreferrer nofollow"
        data-testid={`featured-card-${site.id}`}
        className={cn(
          "group card-surface relative flex h-full flex-col items-center p-5 text-center transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-[0_24px_60px_-28px_var(--glow-strong)]",
          first && "border-brand/40"
        )}
      >
        <span className={cn("absolute left-3 top-3 rounded-full px-2 py-0.5 font-mono text-[11px] font-bold", first ? "bg-brand text-brand-fg" : "bg-secondary text-muted-foreground")}>#{site.featuredRank}</span>
        <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-muted-foreground transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-ink" />
        <SiteLogo src={site.logo} name={site.name} size={60} rounded="rounded-2xl" className="mt-4" />
        <h3 className="mt-4 font-display text-base font-bold tracking-tight">{site.name}</h3>
        <div className="mt-1.5"><Stars value={site.rating} /></div>
        {rateLabel(site.rates) && <p className={cn("mt-2 font-mono text-xs font-semibold", rateTone(site.rates).text)}>{rateLabel(site.rates)} {t("featured.rates").toLowerCase()}</p>}
        <div className="mt-auto pt-3">
          {site.bonus ? <BonusBadge>{site.bonus}</BonusBadge> : <span className="text-[11px] text-muted-foreground">{site.timeToPay}</span>}
        </div>
      </a>
    </Reveal>
  );
};

const FeaturedSites = () => {
  const { t } = useLang();
  const featured = getFeaturedSites();
  return (
    <section id="featured" className="relative scroll-mt-24 border-t border-border bg-surface/30 py-24 md:py-32" data-testid="featured-sites">
      <div className="container-x">
        <Reveal>
          <SectionHeader eyebrow={t("featured.label")} title={t("featured.title")} subtitle={t("featured.subtitle")} />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {featured.map((s, i) => <CompactCard key={s.id} site={s} index={i} />)}
        </div>
        <Reveal className="mt-10 text-center">
          <Button asChild variant="outline" size="lg" className="gap-2 font-semibold">
            <Link to="/Sites" data-testid="featured-more-sites">{t("featured.more")} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
};

export default FeaturedSites;
