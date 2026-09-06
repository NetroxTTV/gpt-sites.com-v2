import React from "react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import { PageHeader } from "@/components/shared/Primitives";
import { SiteCard } from "@/components/shared/Cards";
import SitesToolbar from "@/components/sites/SitesToolbar";
import { SITES } from "@/data/mock";
import { useSiteFilters } from "@/hooks/useSiteFilters";

const SitesResults = ({ results, onReset }) => {
  const { t } = useLang();
  if (results.length === 0) {
    return (
      <div className="card-surface mt-6 flex flex-col items-center gap-4 p-14 text-center" data-testid="sites-empty">
        <p className="text-muted-foreground">{t("sites.noResults")}</p>
        <Button variant="outline" onClick={onReset}>{t("sites.reset")}</Button>
      </div>
    );
  }
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid="sites-grid">
      {results.map((s, i) => <SiteCard key={s.id} site={s} index={i} />)}
    </div>
  );
};

const Sites = () => {
  const { t } = useLang();
  const filters = useSiteFilters();

  return (
    <main data-testid="sites-page">
      <PageHeader eyebrow={`${SITES.length} ${t("sites.sitesWord")}`} title={t("sites.title")} subtitle={t("sites.subtitle")} />

      <section id="all-sites" className="container-x scroll-mt-20 py-10 md:py-14">
        <SitesToolbar state={filters} />

        <p className="mt-6 text-sm text-muted-foreground" data-testid="sites-count">
          {t("sites.showing")} <span className="font-mono font-semibold text-foreground">{filters.results.length}</span> {t("sites.of")} {SITES.length} {t("sites.sitesWord")}
        </p>

        <SitesResults results={filters.results} onReset={filters.reset} />
      </section>
    </main>
  );
};

export default Sites;
