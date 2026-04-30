import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame } from "lucide-react";

import { getProductDetails, productDetailsBySlug } from "../../../lib/meahs-data";

function SpiceMeter({ level }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <Flame
          key={index}
          className={index < level ? "h-4 w-4 text-[#D74B2A]" : "h-4 w-4 text-black/15"}
          fill={index < level ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(productDetailsBySlug).map((slug) => ({ slug }));
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const product = getProductDetails(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="mx-auto mt-10 grid w-full max-w-[1260px] gap-7 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:px-6">
        <div className="relative overflow-hidden rounded-[34px] border border-[color:var(--theme-border)] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.86),rgba(255,255,255,0.56)_55%,transparent_100%)] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          <div className={`absolute inset-x-0 top-0 h-44 bg-gradient-to-br ${product.accent}`} />
          <div className="relative min-h-[460px]">
            <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-contain p-6 drop-shadow-[0_22px_36px_rgba(0,0,0,0.18)]" />
          </div>
        </div>

        <div className="rounded-[34px] border border-[color:var(--theme-border)] bg-white/70 p-7 shadow-[0_20px_48px_rgba(0,0,0,0.06)]">
          <p className="section-eyebrow">Product detail</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {product.badge ? <span className="pill-badge">{product.badge}</span> : null}
            <span className="pill-badge bg-[color:var(--theme-primary)] text-white">{product.price}</span>
            <span className="pill-badge bg-white/70 text-[color:var(--theme-foreground)]">{product.servesLabel}</span>
          </div>
          <h1 className="mt-5 text-5xl font-semibold text-[color:var(--theme-foreground)]">{product.name}</h1>
          <p className="mt-5 text-base leading-8 text-[color:var(--theme-muted)]">{product.description}</p>
          <div className="mt-5 flex items-center gap-3 text-sm text-[color:var(--theme-muted)]">
            <SpiceMeter level={product.spice} />
            <span>{product.heatLabel} heat</span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/70 p-4">
              <p className="text-sm font-semibold text-[color:var(--theme-foreground)]">Recipe idea</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--theme-muted)]">{product.recipeIdea || `${product.recipeTitle} with basmati rice and coriander.`}</p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/70 p-4">
              <p className="text-sm font-semibold text-[color:var(--theme-foreground)]">Storage</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--theme-muted)]">{product.storage}</p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/70 p-4 md:col-span-2">
              <p className="text-sm font-semibold text-[color:var(--theme-foreground)]">Nutrition per 100g</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--theme-muted)]">{product.nutritionPer100g}</p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/70 p-4 md:col-span-2">
              <p className="text-sm font-semibold text-[color:var(--theme-foreground)]">Ingredients and allergens</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--theme-muted)]">{product.ingredientsAllergens}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="secondary-button">Back to products</Link>
            <Link href="/cart" className="primary-button">Review basket</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
