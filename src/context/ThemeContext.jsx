import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "@/lib/storage";

const STORAGE_KEY = "theme";
const THEMES = ["dark", "light"];
const DEFAULT_THEME = "dark";
const ThemeContext = createContext(null);

const getInitial = () => {
  const saved = storage.get(STORAGE_KEY);
  return THEMES.includes(saved) ? saved : DEFAULT_THEME;
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitial);

  useEffect(() => {
    applyTheme(theme);
    storage.set(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next) => {
    if (THEMES.includes(next)) setThemeState(next);
    else console.warn(`[theme] unsupported theme "${next}"`);
  }, []);

  const toggle = useCallback(() => setThemeState((current) => (current === "dark" ? "light" : "dark")), []);

  const value = useMemo(() => ({ theme, setTheme, toggle, isDark: theme === "dark" }), [theme, setTheme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
