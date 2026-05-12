import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPostsBySlug, getBlogPost } from "../../lib/meahs-data";

function buildMetadata(post) {
  return {
    title: post.seoTitle,
    description: post.metaDescription,
    keywords: [post.mainKeyword, ...post.secondaryKeywords],
    alternates: {
      canonical: post.path,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      type: "article",
      url: post.path,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.metaDescription,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(blogPostsBySlug).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return buildMetadata(post);
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = Object.values(blogPostsBySlug)
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  const faqEntities = post.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.metaDescription,
        keywords: [post.mainKeyword, ...post.secondaryKeywords].join(", "),
        mainEntityOfPage: `https://www.curry-sauces.co.uk${post.path}`,
        publisher: {
          "@type": "Organization",
          name: "Meah's Curry Sauces",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqEntities,
      },
    ],
  };

  return (
    <main className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="mx-auto mt-8 w-full max-w-[980px] px-4 lg:px-6">
        <div className="overflow-hidden rounded-[34px] border border-[color:var(--theme-border)] bg-[linear-gradient(135deg,var(--theme-primary),var(--theme-gradientVia),var(--theme-gradientTo))] px-6 py-10 text-white shadow-[0_24px_60px_rgba(0,0,0,0.16)] md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">{post.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/82">{post.metaDescription}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="pill-badge bg-white text-[color:var(--theme-primary)]">{post.mainKeyword}</span>
            {post.secondaryKeywords.map((keyword) => (
              <span key={keyword} className="pill-badge bg-white/12 text-white">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[34px] border border-[color:var(--theme-border)] bg-white/72 p-6 shadow-[0_20px_48px_rgba(0,0,0,0.06)] md:p-9">
          <div className="space-y-5">
            {post.intro.map((paragraph) => (
              <p key={paragraph} className="section-copy">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-3xl font-semibold text-[color:var(--theme-foreground)]">{section.heading}</h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="section-copy">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-[30px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/72 p-6">
            <p className="section-eyebrow">Final call</p>
            <p className="mt-4 text-xl font-semibold text-[color:var(--theme-foreground)]">{post.cta}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="primary-button">
                Shop curry sauces
              </Link>
              <Link href="/contact" className="secondary-button">
                Contact the team
              </Link>
            </div>
          </section>

          <section className="mt-10">
            <p className="section-eyebrow">FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold text-[color:var(--theme-foreground)]">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {post.faq.map((item) => (
                <div key={item.question} className="rounded-[26px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/48 p-5">
                  <h3 className="text-xl font-semibold text-[color:var(--theme-foreground)]">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--theme-muted)]">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="section-eyebrow">More reading</p>
              <h2 className="mt-3 text-3xl font-semibold text-[color:var(--theme-foreground)]">Related curry sauce guides</h2>
            </div>
            <Link href="/news" className="secondary-button">
              Back to blog
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {relatedPosts.map((item) => (
              <article
                key={item.slug}
                className="rounded-[30px] border border-[color:var(--theme-border)] bg-white/70 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.06)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--theme-muted)]">{item.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-semibold text-[color:var(--theme-foreground)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--theme-muted)]">{item.metaDescription}</p>
                <Link href={item.path} className="secondary-button mt-5">
                  Read article
                </Link>
              </article>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
