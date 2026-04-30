import Image from "next/image";

import { PageHero } from "../../components/storefront-sections";
import { newsContent } from "../../lib/meahs-data";

export default function NewsPage() {
  return (
    <main className="page-shell">
      <PageHero
        eyebrow="Latest updates"
        title="Community stories, partnerships, and local brand moments"
        description={newsContent.description}
        imageUrl={newsContent.heroImage}
      />

      <section className="mx-auto mt-16 grid w-full max-w-[1260px] gap-5 px-4 md:grid-cols-2 lg:px-6">
        {newsContent.items.map((item) => (
          <article
            key={item.imageUrl}
            className="overflow-hidden rounded-[30px] border border-[color:var(--theme-border)] bg-white/70 shadow-[0_16px_36px_rgba(0,0,0,0.06)]"
          >
            <div className="relative h-72">
              <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-muted)]">Brand news</p>
              <h2 className="mt-3 text-2xl font-semibold text-[color:var(--theme-foreground)]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[color:var(--theme-muted)]">{item.summary}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
