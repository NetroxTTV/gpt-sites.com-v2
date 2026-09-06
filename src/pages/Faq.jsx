import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLang } from "@/i18n/LanguageContext";
import { PageHeader, Reveal } from "@/components/shared/Primitives";
import { DiscordButton } from "@/components/layout/Navbar";
import { FAQS, FAQ_CATEGORIES, L } from "@/data/content";
import { cn } from "@/lib/utils";

const Faq = () => {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.map((f, i) => ({ ...f, idx: i })).filter((f) => {
      if (cat !== "all" && f.cat !== cat) return false;
      if (q && !`${L(f.q, lang)} ${L(f.a, lang)}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, cat, lang]);

  return (
    <main data-testid="faq-page">
      <PageHeader eyebrow={t("faq.label")} title={t("faq.title")} subtitle={t("faq.subtitle")} />

      <section className="container-x py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("faq.search")} className="h-12 rounded-xl bg-surface pl-11 text-base" data-testid="faq-search" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["all", ...FAQ_CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                data-testid={`faq-category-${c}`}
                className={cn("rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200", cat === c ? "border-brand bg-brand text-brand-fg" : "border-border bg-surface text-muted-foreground hover:border-foreground/30 hover:text-foreground")}
              >
                {t(`faq.${c}`)}
              </button>
            ))}
          </div>

          {results.length === 0 ? (
            <div className="card-surface mt-8 p-14 text-center text-muted-foreground" data-testid="faq-empty">{t("faq.noResults")}</div>
          ) : (
            <Accordion type="single" collapsible className="mt-8 space-y-3" data-testid="faq-list">
              {results.map((f) => (
                <AccordionItem key={f.idx} value={`faq-${f.idx}`} className="card-surface px-6 data-[state=open]:border-brand/50" data-testid={`faq-item-${f.idx}`}>
                  <AccordionTrigger className="py-5 text-left font-display text-base font-bold hover:no-underline md:text-lg">
                    <span className="flex items-start gap-3">
                      <span className="mt-1.5 hidden whitespace-nowrap rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:inline">{t(`faq.${f.cat}`)}</span>
                      {L(f.q, lang)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">{L(f.a, lang)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <Reveal className="card-surface mt-16 flex flex-col items-center gap-4 p-10 text-center">
            <h2 className="font-display text-2xl font-extrabold tracking-tight">{t("faq.stillTitle")}</h2>
            <p className="text-muted-foreground">{t("faq.stillSub")}</p>
            <DiscordButton size="lg" label={t("faq.join")} />
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default Faq;
