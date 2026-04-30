"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { useCart } from "./cart-provider";

function formatMoney(value) {
  const numeric = Number(value);
  return `£${(Number.isFinite(numeric) ? numeric : 0).toFixed(2)}`;
}

export default function CartDrawer() {
  const {
    detailedItems,
    itemCount,
    totalPrice,
    isReady,
    isCartOpen,
    isValidBatch,
    closeCart,
    removeItem,
    setItemQuantity,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-[rgba(17,11,8,0.45)] backdrop-blur-sm"
            aria-label="Close basket drawer"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl flex-col border-l border-[color:var(--theme-border)] bg-[color:var(--theme-background)] shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--theme-border)] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--theme-muted)]">
                  Your basket
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-[color:var(--theme-foreground)]">
                  {isReady ? (itemCount ? `${itemCount} sauces selected` : "Your basket is empty") : "Loading basket..."}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {detailedItems.length ? (
                <div className="space-y-4">
                  {detailedItems.map(({ slug, quantity, product, lineTotal }) => (
                    <article
                      key={slug}
                      className="rounded-[26px] border border-[color:var(--theme-border)] bg-white/65 p-4 shadow-[0_12px_26px_rgba(0,0,0,0.06)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-[color:var(--theme-foreground)]">{product?.name}</p>
                          <p className="mt-1 text-sm text-[color:var(--theme-muted)]">{product?.heatLabel} heat • {product?.servesLabel}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(slug)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--theme-surface)] text-[color:var(--theme-muted)] transition hover:text-[color:var(--theme-primary)]"
                          aria-label={`Remove ${product?.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-2 py-1">
                          <button
                            type="button"
                            onClick={() => setItemQuantity(slug, quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70"
                            aria-label={`Decrease ${product?.name} quantity`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-8 text-center text-sm font-semibold">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setItemQuantity(slug, quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70"
                            aria-label={`Increase ${product?.name} quantity`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-[color:var(--theme-foreground)]">{isReady ? formatMoney(lineTotal) : "Loading..."}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-[30px] border border-dashed border-[color:var(--theme-border)] bg-white/40 px-6 text-center">
                  <ShoppingBag className="h-12 w-12 text-[color:var(--theme-primary)]" />
                  <p className="mt-4 text-2xl font-semibold text-[color:var(--theme-foreground)]">Your basket is empty</p>
                  <p className="mt-2 max-w-sm text-sm leading-7 text-[color:var(--theme-muted)]">
                    Add chilled sauces to start your order. Checkout unlocks when the basket total reaches exactly 6 or 12 jars.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-5 inline-flex rounded-full bg-[color:var(--theme-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    Browse sauces
                  </Link>
                </div>
              )}
            </div>

            <div className="border-t border-[color:var(--theme-border)] px-6 py-5">
              <div className="rounded-[28px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-5">
                <div className="flex items-center justify-between text-sm text-[color:var(--theme-muted)]">
                  <span>Total</span>
                  <span className="text-2xl font-semibold text-[color:var(--theme-foreground)]">{isReady ? formatMoney(totalPrice) : "Loading..."}</span>
                </div>
                <p className={`mt-3 rounded-2xl px-4 py-3 text-sm ${isValidBatch ? "bg-emerald-500/12 text-emerald-900" : "bg-amber-500/14 text-amber-900"}`}>
                  {isValidBatch
                    ? "Basket valid. Chilled delivery is included with your 6 or 12 jar order."
                    : "Orders must contain exactly 6 or 12 sauces. Adjust quantities to continue."}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[color:var(--theme-muted)]">
                  Chilled product. Refrigerate on delivery.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-[color:var(--theme-border)] px-5 py-3 text-sm font-semibold text-[color:var(--theme-foreground)] transition hover:-translate-y-0.5"
                  >
                    Review basket
                  </Link>
                  {isValidBatch ? (
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-[color:var(--theme-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      Checkout
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex flex-1 cursor-not-allowed items-center justify-center rounded-full bg-[color:var(--theme-border)] px-5 py-3 text-sm font-semibold text-[color:var(--theme-muted)]"
                    >
                      Checkout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
