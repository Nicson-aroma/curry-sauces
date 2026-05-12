import Link from "next/link";

import { PageHero } from "../../components/storefront-sections";
import { blogContent } from "../../lib/meahs-data";

export const metadata = {
  title: "Curry Sauce Blog | Buying Guides, Meal Ideas, and Home Cooking Tips",
  description:
    "Explore SEO-focused curry sauce blog articles covering buying guides, takeaway-style cooking, flavour comparisons, and easy meal ideas.",
  alternates: {
    canonical: "/news",
  },
};

export default function NewsPage() {
  return (
    <main className="page-shell">
      <PageHero
        eyebrow="Curry sauce blog"
        title="Buying guides, meal ideas, and home cooking advice"
        description="Browse expert blog content on ready-made curry sauce, takeaway-style meals, flavour profiles, and quick ways to cook authentic curry at home."
        imageUrl="/asset/c4.jpg"
        actions={[
          { label: "Shop sauces", href: "/shop", primary: true },
          { label: "View recipes", href: "/recipes" },
        ]}
      />

      <section className="mx-auto mt-16 w-full max-w-[1260px] px-4 lg:px-6">
        <div className="mb-8 max-w-3xl">
          <p className="section-eyebrow">Latest articles</p>
          <h2 className="section-title">Read our blogs for curry sauce shoppers and home cooks</h2>
          <p className="section-copy mt-4">
            These articles are structured around search demand in the UK and linked closely to the products and use cases customers already care about.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogContent.map((item) => (
          <article
            key={item.slug}
            className="overflow-hidden rounded-[30px] border border-[color:var(--theme-border)] bg-white/70 p-6 shadow-[0_16px_36px_rgba(0,0,0,0.06)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-muted)]">{item.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold text-[color:var(--theme-foreground)]">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--theme-muted)]">{item.metaDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill-badge">{item.mainKeyword}</span>
              {item.secondaryKeywords.slice(0, 2).map((keyword) => (
                <span key={keyword} className="pill-badge bg-white/70 text-[color:var(--theme-foreground)]">
                  {keyword}
                </span>
              ))}
            </div>
            <Link href={item.path} className="secondary-button mt-6">
              Read article
            </Link>
          </article>
        ))}
        </div>
      </section>
    </main>
  );
}
