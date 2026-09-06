import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/i18n/LanguageContext";

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in document.documentElement.style ? "instant" : "auto" });
  }, [pathname]);
  return null;
};

export const BackToTop = () => {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label={t("common.backToTop")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-24 right-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-brand text-brand-fg shadow-lg shadow-black/20 transition-[opacity,transform] duration-300 hover:-translate-y-0.5 lg:bottom-6 lg:right-6",
        show ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
      data-testid="back-to-top"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
};
