import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/i18n/LanguageContext";
import { AnimatedBackdrop } from "@/components/shared/Primitives";

const NotFound = ({ title }) => {
  const { t } = useLang();
  return (
    <main className="relative overflow-hidden" data-testid="not-found-page">
      <AnimatedBackdrop />
      <div className="container-x relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-[7rem] font-extrabold leading-none tracking-tight text-brand-ink md:text-[10rem]">404</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{title || t("notFound.title")}</h1>
        <p className="mt-4 max-w-md text-muted-foreground">{t("notFound.text")}</p>
        <Button asChild size="lg" className="mt-8 gap-2 font-semibold">
          <Link to="/" data-testid="not-found-home"><ArrowLeft className="h-4 w-4" /> {t("notFound.home")}</Link>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
