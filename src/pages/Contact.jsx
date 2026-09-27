import React, { useState } from "react";
import { Copy, Mail } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { PageHeader, Reveal } from "@/components/shared/Primitives";
import { DiscordIcon } from "@/components/layout/Navbar";
import { DISCORD_URL, DISCORD_USERNAME, CONTACT_EMAIL } from "@/data/mock";
import { Button } from "@/components/ui/button";

const CopyButton = ({ value }) => {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
    >
      <Copy className="h-3 w-3" />
      {copied ? t("contact.copied") : t("contact.copy")}
    </button>
  );
};

const Contact = () => {
  const { t } = useLang();

  return (
    <main data-testid="contact-page">
      <PageHeader eyebrow={t("contact.label")} title={t("contact.title")} subtitle={t("contact.subtitle")} />

      <section className="container-x py-10 md:py-14">
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          <Reveal className="card-surface flex flex-col items-start gap-4 p-8">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#5865F2]/10">
              <DiscordIcon className="h-5 w-5 text-[#5865F2]" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">{t("contact.discordTitle")}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t("contact.discordText")} <span className="font-semibold text-foreground">@{DISCORD_USERNAME}</span>
              </p>
            </div>
            <div className="mt-auto flex w-full items-center gap-2 pt-2">
              <Button asChild className="flex-1 gap-2 bg-[#5865F2] text-white hover:bg-[#4752c4]">
                <a href={DISCORD_URL} target="_blank" rel="noreferrer" data-testid="contact-discord-link">
                  <DiscordIcon className="h-4 w-4" />
                  {t("contact.discordCta")}
                </a>
              </Button>
              <CopyButton value={DISCORD_USERNAME} />
            </div>
          </Reveal>

          <Reveal delay={80} className="card-surface flex flex-col items-start gap-4 p-8">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10">
              <Mail className="h-5 w-5 text-brand-ink" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">{t("contact.emailTitle")}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t("contact.emailText")}</p>
              <p className="mt-2 break-all font-mono text-sm font-semibold text-foreground">{CONTACT_EMAIL}</p>
            </div>
            <div className="mt-auto flex w-full items-center gap-2 pt-2">
              <Button asChild variant="outline" className="flex-1 gap-2">
                <a href={`mailto:${CONTACT_EMAIL}`} data-testid="contact-email-link">
                  <Mail className="h-4 w-4" />
                  {t("contact.emailCta")}
                </a>
              </Button>
              <CopyButton value={CONTACT_EMAIL} />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
};

export default Contact;
