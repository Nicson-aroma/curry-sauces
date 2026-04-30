"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { themes } from "../lib/meahs-data";

const STORAGE_KEY = "meahs-theme";
const ThemeContext = createContext(null);

function applyTheme(theme) {
  if (!theme || typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.themeChoice = theme.id;

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(themes[0].id);

  const theme = useMemo(
    () => themes.find((item) => item.id === themeId) ?? themes[0],
    [themeId]
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const savedThemeId = window.localStorage.getItem(STORAGE_KEY);
        if (savedThemeId && themes.some((item) => item.id === savedThemeId)) {
          setThemeId(savedThemeId);
        }
      } catch {
        // Ignore storage access errors.
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme.id);
    } catch {
      // Ignore persistence errors.
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themes, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeChoice() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeChoice must be used within ThemeProvider.");
  }

  return context;
}
