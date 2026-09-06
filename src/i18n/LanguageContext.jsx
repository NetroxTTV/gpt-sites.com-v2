import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS, LANGUAGES } from "./translations";
import { storage } from "@/lib/storage";

const STORAGE_KEY = "gpts.lang";
const DEFAULT_LANG = "en";
const LanguageContext = createContext(null);

const getPath = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

const isSupported = (code) => Boolean(code && TRANSLATIONS[code]);

const detectInitial = () => {
  const saved = storage.get(STORAGE_KEY);
  if (isSupported(saved)) return saved;
  // Set server-side from Cloudflare's CF-IPCountry header (see server.cjs) -
  // more reliable than browser locale for visitors whose OS/browser language
  // doesn't match where they actually are.
  const geo = typeof window !== "undefined" ? window.__GEO_LANG__ : undefined;
  if (isSupported(geo)) return geo;
  const browser = (typeof navigator !== "undefined" ? navigator.language || "" : "").slice(0, 2).toLowerCase();
  return isSupported(browser) ? browser : DEFAULT_LANG;
};

/** Translate a dotted key, falling back to English, then to the key itself. */
export const translate = (lang, path, fallback) => {
  const value = getPath(TRANSLATIONS[lang], path);
  if (value !== undefined) return value;
  const english = getPath(TRANSLATIONS[DEFAULT_LANG], path);
  if (english !== undefined) return english;
  return fallback ?? path;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(detectInitial);

  useEffect(() => {
    storage.set(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((code) => {
    if (isSupported(code)) setLangState(code);
    else console.warn(`[i18n] unsupported language "${code}"`);
  }, []);

  const t = useCallback((path, fallback) => translate(lang, path, fallback), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, languages: LANGUAGES }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
};
