"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 680);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-primary)] text-white shadow-[0_18px_36px_rgba(0,0,0,0.18)] transition hover:-translate-y-1"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
