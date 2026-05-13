"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { subscribeEmail } from "../lib/subscribe";

const STORAGE_KEY = "meahs-newsletter-dismissed";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    function handleScroll() {
      const progress = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
      if (progress < 0.6) {
        return;
      }

      try {
        if (window.sessionStorage.getItem(STORAGE_KEY) === "true") {
          return;
        }
        window.sessionStorage.setItem(STORAGE_KEY, "true");
      } catch {
        return;
      }

      setIsOpen(true);
      window.removeEventListener("scroll", handleScroll);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleSubscribe() {
    setIsSubmitting(true);
    setFeedback("");

    try {
      await subscribeEmail({ email, source: "newsletter_popup" });
      setFeedback("Subscribed. Watch your inbox for updates.");
      setEmail("");
      window.setTimeout(() => setIsOpen(false), 1000);
    } catch (error) {
      setFeedback(error.message || "Unable to subscribe right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[rgba(19,12,8,0.48)] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-xl -translate-y-1/2 rounded-[32px] border border-white/10 bg-[color:var(--theme-foreground)] px-6 py-6 text-[color:var(--theme-background)] shadow-[0_32px_100px_rgba(0,0,0,0.28)]"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="Close newsletter popup"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-white/70">
              <Sparkles className="h-3.5 w-3.5" />
              Join the spice club
            </div>
            <h3 className="mt-4 text-3xl font-semibold">News, recipes, and market dates in one email.</h3>
            <p className="mt-3 max-w-lg text-sm leading-7 text-white/70">
              Be first to hear about new recipe ideas, local tasting events, and chilled delivery updates from Meah&apos;s Curry Sauces.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <label className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-3">
                <Mail className="h-4 w-4 text-white/60" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                />
              </label>
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={isSubmitting}
                className="rounded-full bg-[color:var(--theme-secondary)] px-5 py-3 text-sm font-semibold text-[color:var(--theme-foreground)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(0,0,0,0.22)]"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {feedback ? <p className="mt-3 text-sm text-white/80">{feedback}</p> : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
