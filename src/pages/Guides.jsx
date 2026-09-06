import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/i18n/LanguageContext";
import { PageHeader, Reveal } from "@/components/shared/Primitives";
import { GuideCard } from "@/components/shared/Cards";
import { FilterChip, SearchField } from "@/components/sites/SitesToolbar";
import { GUIDES, GUIDE_CATEGORIES, DIFFICULTIES } from "@/data/content";
import { DISCORD_URL } from "@/data/mock";
import { useGuideFilters, GUIDE_WALLS, countGuidesFor } from "@/hooks/useGuideFilters";
import { cn } from "@/lib/utils";

const slugKey = (c) => c.toLowerCase().replace(/[^a-z]+/g, "-");

const GUIDES_PER_PAGE = 9;

const Pagination = ({ page, pageCount, onChange }) => {
  const { t } = useLang();
  if (pageCount <= 1) return null;
  const navBtn =
    "grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:pointer-events-none disabled:opacity-40";
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label={t("common.pageWord")} data-testid="guides-pagination">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label={t("common.prevPage")} className={navBtn} data-testid="guides-prev-page">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          data-testid={`guides-page-${p}`}
          className={cn(
            "h-10 min-w-10 rounded-full border px-3.5 font-mono text-sm font-semibold transition-colors",
            p === page
              ? "border-brand bg-brand text-brand-fg"
              : "border-border bg-surface text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          )}
        >
          {p}
        </button>
      ))}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label={t("common.nextPage")} className={navBtn} data-testid="guides-next-page">
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

const GuideFilters = ({ state }) => {
  const { t } = useLang();
  const { query, setQuery, category, setCategory, difficulty, setDifficulty, wall, setWall, sort, setSort } = state;
  return (
    <div className="card-surface p-4 md:p-5" data-testid="guides-filters">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <SearchField value={query} onChange={setQuery} placeholder={t("guides.search")} testId="guides-search" className="xl:col-span-2" />
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="h-10 bg-background" data-testid="guides-filter-difficulty"><SelectValue placeholder={t("guides.difficulty")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("guides.allDifficulties")}</SelectItem>
            {DIFFICULTIES.map((d) => <SelectItem key={d} value={d.toLowerCase()}>{t(`common.${d.toLowerCase()}`)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={wall} onValueChange={setWall}>
          <SelectTrigger className="h-10 bg-background" data-testid="guides-filter-wall"><SelectValue placeholder={t("guides.offerwall")} /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">{t("guides.allOfferwalls")}</SelectItem>
            {GUIDE_WALLS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-10 bg-background" data-testid="guides-sort"><SelectValue placeholder={t("guides.sortBy")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="best">{t("guides.bestMatch")}</SelectItem>
            <SelectItem value="payout">{t("guides.highestPayout")}</SelectItem>
            <SelectItem value="name">{t("guides.nameAZ")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["all", ...GUIDE_CATEGORIES].map((c) => (
          <FilterChip key={c} active={category === c} onClick={() => setCategory(c)} count={countGuidesFor(c)} testId={`guides-category-${slugKey(c)}`}>
            {c === "all" ? t("guides.allCategories") : c}
          </FilterChip>
        ))}
      </div>
    </div>
  );
};

const GuideResults = ({ results, onReset }) => {
  const { t } = useLang();
  if (results.length === 0) {
    return (
      <div className="card-surface mt-6 flex flex-col items-center gap-4 p-14 text-center" data-testid="guides-empty">
        <p className="text-muted-foreground">{t("guides.noResults")}</p>
        <Button variant="outline" onClick={onReset}>{t("guides.reset")}</Button>
      </div>
    );
  }
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="guides-grid">
      {results.map((g) => <GuideCard key={g.slug} guide={g} />)}
    </div>
  );
};

const SubmitGuide = () => {
  const { t } = useLang();
  return (
    <Reveal className="mt-20 grid gap-6 lg:grid-cols-12">
      <div className="card-surface p-8 lg:col-span-5">
        <h3 className="font-display text-xl font-bold">{t("guides.submitTitle")}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("guides.submitText")}</p>
        <Button asChild variant="outline" className="mt-5 gap-2 font-semibold">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer">discord.gg/gptfr <ExternalLink className="h-4 w-4" /></a>
        </Button>
      </div>
      <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground lg:col-span-7 lg:pt-2">
        <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{t("guides.submitNote1")}</li>
        <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{t("guides.submitNote2")}</li>
      </ul>
    </Reveal>
  );
};

const Guides = () => {
  const { t } = useLang();
  const filters = useGuideFilters();
  const [page, setPage] = useState(1);
  const { query, category, difficulty, wall, sort } = filters;

  useEffect(() => {
    setPage(1);
  }, [query, category, difficulty, wall, sort]);

  const pageCount = Math.max(1, Math.ceil(filters.results.length / GUIDES_PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const pageResults = filters.results.slice((safePage - 1) * GUIDES_PER_PAGE, safePage * GUIDES_PER_PAGE);

  const changePage = (next) => {
    setPage(Math.min(Math.max(1, next), pageCount));
    document.getElementById("guides-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const stats = [
    { value: GUIDES.length, label: t("guides.guidesCount") },
    { value: GUIDE_CATEGORIES.length, label: t("guides.categories") },
    { value: GUIDE_WALLS.length, label: t("guides.offerwalls") },
  ];

  return (
    <main data-testid="guides-page">
      <PageHeader
        eyebrow={t("guides.label")}
        title={t("guides.title")}
        subtitle={t("guides.subtitle")}
        aside={
          <div className="grid w-full max-w-md gap-3 sm:grid-cols-3 lg:w-[380px]" data-testid="guides-stats">
            {stats.map((s) => (
              <div key={s.label} className="card-surface p-4 text-center">
                <p className="font-display text-3xl font-extrabold text-brand-ink">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        }
      />

      <section className="container-x py-10 md:py-14">
        <GuideFilters state={filters} />
        <div id="guides-results" className="mt-6 flex scroll-mt-28 items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" data-testid="guides-count">
            {t("guides.showing")} <span className="font-mono font-semibold text-foreground">{filters.results.length}</span> {t("guides.of")} {GUIDES.length} {t("guides.guidesWord")}
          </p>
          {pageCount > 1 && (
            <p className="font-mono text-xs text-muted-foreground" data-testid="guides-page-indicator">
              {t("common.pageWord")} {safePage}/{pageCount}
            </p>
          )}
        </div>
        <GuideResults results={pageResults} onReset={filters.reset} />
        <Pagination page={safePage} pageCount={pageCount} onChange={changePage} />
        <SubmitGuide />
      </section>
    </main>
  );
};

export default Guides;
