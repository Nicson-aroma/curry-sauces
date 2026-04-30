"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useState } from "react";

import { useThemeChoice } from "./theme-provider";

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, themes, setThemeId } = useThemeChoice();

  return (
    <div className="fixed right-4 top-1/2 z-50 -translate-y-1/2">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="group flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/90 text-[color:var(--theme-foreground)] shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.24)]"
        aria-label="Choose theme"
      >
        <Palette className="h-5 w-5 transition group-hover:rotate-12" />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, x: 18, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 18, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="absolute right-16 top-1/2 w-72 -translate-y-1/2 rounded-[28px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[color:var(--theme-muted)]">
              Theme chooser
            </p>
            <div className="mt-4 space-y-3">
              {themes.map((option) => {
                const active = option.id === theme.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setThemeId(option.id)}
                    className={`w-full rounded-[22px] border px-4 py-3 text-left transition ${
                      active
                        ? "border-transparent bg-[color:var(--theme-primary)] text-white shadow-[0_18px_40px_rgba(139,30,30,0.28)]"
                        : "border-[color:var(--theme-border)] bg-white/20 text-[color:var(--theme-foreground)] hover:-translate-y-0.5 hover:border-[color:var(--theme-primary)]/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {[option.colors.primary, option.colors.secondary, option.colors.accent].map((swatch) => (
                          <span
                            key={swatch}
                            className="h-4 w-4 rounded-full border border-black/10"
                            style={{ backgroundColor: swatch }}
                          />
                        ))}
                      </div>
                      <div>
                        <p className="font-semibold">{option.name}</p>
                        <p className={`text-xs ${active ? "text-white/75" : "text-[color:var(--theme-muted)]"}`}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
