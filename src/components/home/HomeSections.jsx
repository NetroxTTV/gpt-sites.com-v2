import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLang } from "@/i18n/LanguageContext";
import { Reveal, SectionHeader, Eyebrow } from "@/components/shared/Primitives";
import { EventCard, GuideCard, FeedRow } from "@/components/shared/Cards";
import { DiscordButton } from "@/components/layout/Navbar";
import { EVENTS, GUIDES, FAQS, L } from "@/data/content";
import { useFeedItems } from "@/hooks/useLiveFeed";

/* -------------------------------------------------------------- LiveTeaser */
export const LiveTeaser = () => {
  const { t } = useLang();
  // Real activity from the shared CashInStyle + SharkEarnings feed store.
  const { items: allItems, freshId } = useFeedItems();
  const items = allItems.slice(0, 7);

  return (
    <section className="border-t border-border py-24 md:py-32" data-testid="live-teaser">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="text-center md:text-left lg:col-span-5">
          <Eyebrow>{t("liveHome.label")}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.08]">{t("liveHome.title")}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t("liveHome.subtitle")}</p>
          <Button asChild size="lg" className="mt-8 gap-2 font-semibold">
            <Link to="/LiveFeed" data-testid="live-teaser-cta">{t("liveHome.viewFeed")} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </Reveal>
        <Reveal delay={120} className="min-w-0 lg:col-span-7">
          <div className="card-surface relative w-full max-w-full overflow-hidden p-3 sm:p-4">
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mint"><span className="live-dot" />{t("feed.live")}</span>
              <span className="font-mono text-[11px] text-muted-foreground">CashInStyle · SharkEarnings</span>
            </div>
            <div className="space-y-1">
              {items.map((it) => <FeedRow key={it.id} item={it} fresh={it.id === freshId} />)}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------ EventsTeaser */
export const EventsTeaser = () => {
  const { t } = useLang();
  return (
    <section className="border-t border-border bg-surface/30 py-24 md:py-32" data-testid="events-teaser">
      <div className="container-x">
        <Reveal className="text-center md:text-left">
          <SectionHeader align="left" eyebrow={t("eventsHome.label")} title={t("eventsHome.title")} subtitle={t("eventsHome.subtitle")} />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {EVENTS.map((e, i) => (
            <Reveal key={e.id} delay={i * 90}><EventCard event={e} /></Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center md:text-left">
          <Button asChild variant="outline" className="gap-2 font-semibold">
            <Link to="/Events" data-testid="events-teaser-cta">{t("eventsHome.viewAll")} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------ GuidesTeaser */
export const GuidesTeaser = () => {
  const { t } = useLang();
  const top = [...GUIDES].sort((a, b) => b.payoutValue - a.payoutValue).slice(0, 3);
  return (
    <section className="border-t border-border py-24 md:py-32" data-testid="guides-teaser">
      <div className="container-x">
        <Reveal>
          <SectionHeader eyebrow={t("guidesHome.label")} title={t("guidesHome.title")} subtitle={t("guidesHome.subtitle")} />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {top.map((g, i) => (
            <Reveal key={g.slug} delay={i * 90}><GuideCard guide={g} compact /></Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Button asChild variant="outline" size="lg" className="gap-2 font-semibold">
            <Link to="/Guides" data-testid="guides-teaser-cta">{t("guidesHome.viewAll")} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
};

/* --------------------------------------------------------------- FaqTeaser */
export const FaqTeaser = () => {
  const { t, lang } = useLang();
  const items = FAQS.slice(0, 6);
  return (
    <section className="border-t border-border bg-surface/30 py-24 md:py-32" data-testid="faq-teaser">
      <div className="container-x">
        <Reveal>
          <SectionHeader eyebrow={t("faqHome.label")} title={t("faqHome.title")} subtitle={t("faqHome.subtitle")} />
        </Reveal>
        <Reveal className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((f, i) => (
              <AccordionItem key={f.q.en} value={`faq-${i}`} className="card-surface px-6 data-[state=open]:border-brand/50" data-testid={`faq-home-item-${i}`}>
                <AccordionTrigger className="py-5 text-left font-display text-base font-bold hover:no-underline md:text-lg">{L(f.q, lang)}</AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">{L(f.a, lang)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <Link to="/Faq" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink hover:underline" data-testid="faq-teaser-cta">{t("faqHome.viewAll")} <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* --------------------------------------------------------------- CtaBanner */
export const CtaBanner = () => {
  const { t } = useLang();
  return (
    <section className="container-x py-12 md:py-16" data-testid="cta-banner">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-brand px-8 py-14 text-brand-fg md:px-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 grid-bg-dark opacity-40" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="relative flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl md:leading-[1.05]">{t("cta.title")}</h2>
              <p className="mt-4 text-base leading-relaxed text-brand-fg/80 md:text-lg">{t("cta.subtitle")}</p>
            </div>
            <DiscordButton size="lg" className="h-12 shrink-0 border-white/30 bg-white px-7 text-base font-semibold text-[#1d4ed8] hover:bg-white/90 hover:text-[#1d4ed8] [&_svg]:text-[#5865F2]" label={t("cta.button")} />
          </div>
        </div>
      </Reveal>
    </section>
  );
};
