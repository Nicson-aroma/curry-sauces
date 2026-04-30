"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ShoppingBag } from "lucide-react";

import { useCart } from "./cart-provider";
import CheckoutButton from "./checkout-button";

function formatMoney(value) {
  const numeric = Number(value);
  return `£${(Number.isFinite(numeric) ? numeric : 0).toFixed(2)}`;
}

export default function CartPageContent() {
  const {
    detailedItems,
    items,
    itemCount,
    totalPrice,
    isReady,
    isValidBatch,
    clearCart,
    removeItem,
    setItemQuantity,
  } = useCart();

  return (
    <main className="page-shell">
      <section className="mx-auto mt-10 w-full max-w-[1260px] px-4 lg:px-6">
        <div className="rounded-[34px] border border-[color:var(--theme-border)] bg-[linear-gradient(135deg,var(--theme-primary),var(--theme-gradientVia),var(--theme-gradientTo))] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">Basket review</p>
          <h1 className="mt-5 text-5xl font-semibold">Your chilled sauce order</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/82">
            Orders are delivered only in valid batches of 6 or 12 jars. Adjust quantities below and continue to secure chilled delivery.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-[1260px] gap-6 px-4 lg:grid-cols-[1.12fr_0.88fr] lg:px-6">
        <div className="space-y-4">
          {detailedItems.length ? (
            detailedItems.map(({ slug, product, quantity, lineTotal }) => (
              <article key={slug} className="rounded-[28px] border border-[color:var(--theme-border)] bg-white/75 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.05)] lg:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),rgba(255,255,255,0.45)_58%,transparent_100%)] sm:h-28 sm:w-28">
                      {product?.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product?.name ?? "Cart product"}
                          fill
                          sizes="112px"
                          className="object-contain p-2"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xl font-semibold text-[color:var(--theme-foreground)] sm:text-2xl">{product?.name}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-[color:var(--theme-muted)]">{product?.shortDescription}</p>
                      <div className="mt-3 inline-flex rounded-full bg-[color:var(--theme-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--theme-foreground)]">
                        {product?.heatLabel} heat
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(slug)} className="secondary-button h-fit !px-4 !py-2">
                    Remove
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--theme-border)] pt-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-2 py-1">
                    <button type="button" className="h-9 w-9 rounded-full bg-white/70 text-lg" onClick={() => setItemQuantity(slug, quantity - 1)}>
                      -
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
                    <button type="button" className="h-9 w-9 rounded-full bg-white/70 text-lg" onClick={() => setItemQuantity(slug, quantity + 1)}>
                      +
                    </button>
                  </div>
                  <p className="text-xl font-semibold text-[color:var(--theme-foreground)]">{isReady ? formatMoney(lineTotal) : "Loading..."}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[30px] border border-dashed border-[color:var(--theme-border)] bg-white/55 px-6 py-16 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-[color:var(--theme-primary)]" />
              <p className="mt-4 text-3xl font-semibold text-[color:var(--theme-foreground)]">Your basket is empty</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--theme-muted)]">
                Add sauces from the shop to build a valid chilled delivery order.
              </p>
              <Link href="/shop" className="primary-button mt-6 inline-flex">
                Browse sauces
              </Link>
            </div>
          )}
        </div>

        <aside className="rounded-[30px] border border-[color:var(--theme-border)] bg-white/78 p-6 shadow-[0_16px_36px_rgba(0,0,0,0.05)]">
          <p className="section-eyebrow">Order summary</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between text-sm text-[color:var(--theme-muted)]">
              <span>Jars selected</span>
              <span className="font-semibold text-[color:var(--theme-foreground)]">{isReady ? itemCount : "..."}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[color:var(--theme-muted)]">
              <span>Subtotal</span>
              <span className="font-semibold text-[color:var(--theme-foreground)]">{isReady ? formatMoney(totalPrice) : "Loading..."}</span>
            </div>
            <div className="flex items-center justify-between border-t border-[color:var(--theme-border)] pt-4">
              <span className="text-base font-semibold text-[color:var(--theme-foreground)]">Estimated total</span>
              <span className="text-3xl font-semibold text-[color:var(--theme-primary)]">{isReady ? formatMoney(totalPrice) : "Loading..."}</span>
            </div>
          </div>

          <div className={`mt-6 rounded-[24px] px-4 py-4 text-sm leading-7 ${isValidBatch ? "bg-emerald-500/12 text-emerald-900" : "bg-amber-500/16 text-amber-900"}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-4 w-4 shrink-0" />
              <p>
                {isValidBatch
                  ? "Your basket meets the 6 or 12 jar rule. Chilled delivery is included."
                  : "Your basket must contain exactly 6 or 12 sauces before checkout can continue."}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-[color:var(--theme-muted)]">
            Orders before 1:00pm usually arrive next day. Friday orders arrive Tuesday. Refrigerate on delivery.
          </p>

          <div className="mt-6">
            <CheckoutButton items={items} disabled={!isValidBatch || !items.length} />
          </div>

          <button type="button" onClick={clearCart} className="secondary-button mt-4 w-full justify-center">
            Clear basket
          </button>
        </aside>
      </section>
    </main>
  );
}
