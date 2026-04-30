"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";

import { brand, navLinks } from "../lib/meahs-data";
import { useCart } from "./cart-provider";

export default function SiteHeader() {
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 18);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "border-b border-[color:var(--theme-border)] bg-[color:var(--theme-background)]/85 shadow-[0_16px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
        >
        <div className="mx-auto flex w-full max-w-[1260px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
              <Image
                src="/asset/logo.gif"
                alt="Meah's Sauces logo"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--theme-muted)]">Meah&apos;s Sauces</p>

             
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium text-[color:var(--theme-foreground)] transition hover:text-[color:var(--theme-primary)]"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[color:var(--theme-primary)] transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/85 text-[color:var(--theme-foreground)] shadow-[0_10px_22px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5"
              aria-label={`Open basket with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--theme-primary)] px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            </button>

            <Link
              href="/shop"
              className="hidden rounded-full border border-[color:var(--theme-secondary)]/45 bg-[linear-gradient(135deg,var(--theme-secondary),var(--theme-gradientTo))] px-5 py-3 text-sm font-semibold text-[color:var(--theme-foreground)] shadow-[0_16px_34px_rgba(245,166,35,0.28)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(245,166,35,0.36)] lg:inline-flex"
            >
              Shop Now
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/85 text-[color:var(--theme-foreground)] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-[rgba(17,11,8,0.44)] backdrop-blur-sm lg:hidden"
              aria-label="Close navigation"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-sm flex-col bg-[color:var(--theme-background)] px-6 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] lg:hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--theme-muted)]">Navigation</p>
                  <p className="mt-1 text-xl font-semibold text-[color:var(--theme-foreground)]">{brand.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--theme-border)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-10 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-[22px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-5 py-4 text-base font-medium text-[color:var(--theme-foreground)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    openCart();
                    setIsOpen(false);
                  }}
                  className="w-full rounded-full border border-[color:var(--theme-border)] px-5 py-3 text-sm font-semibold text-[color:var(--theme-foreground)]"
                >
                  Open basket
                </button>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-full bg-[color:var(--theme-primary)] px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Shop now
                </Link>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
