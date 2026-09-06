import React from "react";
import { Layers, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/i18n/LanguageContext";
import { OFFERWALL_KEYS, offerwallLabel } from "@/data/mock";
import { SITE_FILTERS, countSitesFor } from "@/hooks/useSiteFilters";
import { cn } from "@/lib/utils";

export const FilterChip = ({ active, onClick, count, children, testId }) => (
  <button
    type="button"
    onClick={onClick}
    data-testid={testId}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200",
      active ? "border-brand bg-brand text-brand-fg" : "border-border bg-surface text-muted-foreground hover:border-foreground/30 hover:text-foreground"
    )}
  >
    {children}
    {count !== undefined && <span className={cn("rounded-full px-1.5 font-mono text-[10px]", active ? "bg-brand-fg/15" : "bg-secondary")}>{count}</span>}
  </button>
);

export const SearchField = ({ value, onChange, placeholder, testId, className }) => (
  <div className={cn("relative", className)}>
    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 bg-surface pl-9 pr-9" data-testid={testId} />
    {value && (
      <button type="button" onClick={() => onChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear">
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);

const SitesToolbar = ({ state }) => {
  const { t } = useLang();
  const { query, setQuery, filter, setFilter, wall, setWall, sort, setSort } = state;
  return (
    <div className="z-30 -mx-5 border-b border-border bg-background/85 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:sticky lg:top-[72px]" data-testid="sites-toolbar">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {SITE_FILTERS.map((f) => (
            <FilterChip key={f} active={filter === f} onClick={() => setFilter(f)} count={countSitesFor(f)} testId={`sites-filter-${f}`}>
              {t(`sites.${f}`)}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SearchField value={query} onChange={setQuery} placeholder={t("sites.search")} testId="sites-search" className="min-w-[200px] flex-1 lg:w-56 lg:flex-none" />
          <Select value={wall} onValueChange={setWall}>
            <SelectTrigger className="h-10 w-[170px] bg-surface" data-testid="sites-offerwall">
              <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">{t("sites.allWalls")}</SelectItem>
              {OFFERWALL_KEYS.map((k) => <SelectItem key={k} value={k}>{offerwallLabel(k)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-10 w-[170px] bg-surface" data-testid="sites-sort">
              <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">{t("sites.sortRank")}</SelectItem>
              <SelectItem value="rate">{t("sites.sortRate")}</SelectItem>
              <SelectItem value="name">{t("sites.sortName")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SitesToolbar;
