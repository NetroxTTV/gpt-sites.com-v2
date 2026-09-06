import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Clock, ExternalLink, Gamepad2, Info, Layers, ListOrdered, Smartphone, Wallet, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import { SiteLogo, RateMeter } from "@/components/shared/Primitives";
import { DiscordButton } from "@/components/layout/Navbar";
import GuideContent, { sectionId } from "@/components/guides/GuideContent";
import { getGuideBySlug } from "@/data/content";
import { getSiteByName } from "@/data/mock";
import { difficultyClass, difficultyKey } from "@/lib/format";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

const MetaChip = ({ icon: Icon, label, value }) => (
  <div className="card-surface flex items-center gap-3 p-4">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-ink"><Icon className="h-4 w-4" /></span>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-semibold" title={value}>{value}</p>
    </div>
  </div>
);

const GuideDetail = () => {
  const { slug } = useParams();
  const { t } = useLang();
  const guide = getGuideBySlug(slug);
  if (!guide) return <NotFound title={t("guides.notFound")} />;

  const dKey = difficultyKey(guide.difficulty);
  const sites = (guide.sites || []).map((s) => ({ ...s, site: getSiteByName(s.name) }));
  const cover = guide.banner || guide.logo;

  return (
    <main data-testid="guide-detail-page">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          {cover ? <img src={cover} alt="" className="h-full w-full scale-105 object-cover opacity-25 blur-md" /> : <div className="h-full w-full grid-bg" />}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" />
        </div>
        <div className="container-x relative pb-12 pt-10 md:pb-16 md:pt-14">
          <Link to="/Guides" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" data-testid="guide-back">
            <ArrowLeft className="h-4 w-4" /> {t("guides.back")}
          </Link>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end">
            {cover && <img src={cover} alt={guide.title} className="h-44 w-full rounded-2xl border border-border object-cover shadow-2xl shadow-black/30 md:h-48 md:w-80" />}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-semibold">{guide.category}</span>
                {guide.offerwalls.map((w) => <span key={w} className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-semibold text-brand-fg">{w}</span>)}
                <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", difficultyClass(guide.difficulty))}>{dKey ? t(`common.${dKey}`) : guide.difficulty}</span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl md:leading-[1.05]">{guide.title}</h1>
              {guide.summary && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{guide.summary}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-10 md:py-14">
        <div className={cn("grid gap-3 sm:grid-cols-2", guide.money ? "lg:grid-cols-5" : "lg:grid-cols-4")} data-testid="guide-meta">
          <MetaChip icon={Wallet} label={t("guides.payout")} value={guide.payout} />
          <MetaChip icon={Clock} label={t("guides.duration")} value={guide.duration} />
          <MetaChip icon={Smartphone} label={t("guides.platform")} value={guide.platform} />
          <MetaChip icon={Gamepad2} label={t("guides.genre")} value={guide.genre} />
          {guide.money && <MetaChip icon={Coins} label={t("guides.money")} value={guide.money} />}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <GuideContent sections={guide.sections} />
            <p className="mt-10 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t("guides.disclaimer")}</p>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-5">
              {guide.sections?.length > 2 && (
                <nav className="card-surface hidden p-5 lg:block" data-testid="guide-toc" aria-label="Sections">
                  <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"><ListOrdered className="h-3.5 w-3.5" /> {t("guides.contents")}</p>
                  <ol className="mt-3 space-y-1">
                    {guide.sections.map((s, i) => (
                      <li key={sectionId(s.title, i)}>
                        <a href={`#${sectionId(s.title, i)}`} className="flex gap-2.5 rounded-lg px-2 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground">
                          <span className="font-mono text-xs text-brand-ink">{String(i + 1).padStart(2, "0")}</span>
                          <span className="line-clamp-1">{s.title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div className="card-surface p-6" data-testid="guide-best-sites">
                <h3 className="inline-flex items-center gap-2 font-display text-lg font-bold"><Layers className="h-5 w-5 text-brand-ink" /> {t("guides.bestSites")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {sites.length === 1 ? `${t("guides.exclusiveTo")} ${sites[0].name}.` : `${t("guides.bestSitesSub")} ${guide.offerwall}.`}
                </p>
                <ul className="mt-5 space-y-3">
                  {sites.map((s) => (
                    <li key={s.name}>
                      <a href={s.url} target="_blank" rel="noreferrer nofollow" className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:border-brand/50">
                        <SiteLogo src={s.site?.logo} name={s.name} size={40} rounded="rounded-lg" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{s.name}</p>
                          {s.site?.rates ? <RateMeter rates={s.site.rates} compact /> : <p className="truncate text-xs text-muted-foreground">{s.desc}</p>}
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-brand-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-5 w-full gap-2 font-semibold">
                  <Link to="/Sites">{t("featured.more")} <ExternalLink className="h-4 w-4" /></Link>
                </Button>
                <div className="mt-3"><DiscordButton className="w-full" label={t("hero.ctaDiscord")} /></div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default GuideDetail;
