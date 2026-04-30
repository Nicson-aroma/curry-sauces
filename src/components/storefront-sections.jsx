"use client";

import Image from "next/image";
import Link from "next/link";
import { Tabs } from "antd";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Beef,
  ChevronRight,
  Clock3,
  Flame,
  Leaf,
  MapPinned,
  PackageCheck,
  Search,
  ShoppingBasket,
  Soup,
  Sparkles,
  Truck,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import {
  brand,
  bundleOptions,
  deliveryRules,
  eventsContent,
  featuredProducts,
  heritageContent,
  homeContent,
  productDetailsTabs,
  recipes,
  storyStats,
} from "../lib/meahs-data";
import { fadeInUp, scaleIn, slideInLeft, slideInRight, staggerContainer } from "../lib/motion";
import { useCart } from "./cart-provider";

function cn(...values) {
  return values.filter(Boolean).join(" ");
}

function Section({ id, eyebrow, title, description, children, className }) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-[1260px] px-4 lg:px-6", className)}>
      <div className="mb-8 max-w-3xl">
        {eyebrow ? (
          <p className="section-eyebrow">{eyebrow}</p>
        ) : null}
        <h2 className="section-title">{title}</h2>
        {description ? <p className="section-copy mt-4">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function SpiceMeter({ level }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <Flame
          key={index}
          className={cn(
            "h-4 w-4",
            index < level ? "text-[#D74B2A]" : "text-black/15"
          )}
          fill={index < level ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, onAdd, featured = false }) {
  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -10, rotateX: 4 }}
      className="group relative overflow-hidden rounded-[30px] border border-[color:var(--theme-border)] bg-white/65 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.07)] backdrop-blur-xl"
    >
      <div className={cn("absolute inset-x-0 top-0 h-40 bg-gradient-to-br opacity-95", product.accent)} />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.badge ? <span className="pill-badge">{product.badge}</span> : null}
              <span className="pill-badge bg-white/55 text-[color:var(--theme-foreground)]">{product.heatLabel}</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-white">{product.name}</h3>
            <p className="mt-2 text-sm text-white/78">{product.shortDescription}</p>
          </div>
          <div className="rounded-full bg-white/18 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md">
            {product.price}
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-[26px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(255,255,255,0.58)_55%,transparent_100%)] p-4">
          <motion.div whileHover={{ rotate: 4, scale: 1.02 }} className="relative mx-auto h-56 w-full max-w-[220px]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 70vw, 260px"
              className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)]"
            />
          </motion.div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-[color:var(--theme-muted)]">
          <span>{product.servesLabel}</span>
          <SpiceMeter level={product.spice} />
        </div>

        <div className="mt-5 flex gap-3">
          <Link href={`/products/${product.slug}`} className="secondary-button flex-1 text-center">
            View Details
          </Link>
          <button type="button" onClick={() => onAdd(product.slug)} className={cn("primary-button flex-1", featured && "shadow-[0_16px_34px_rgba(139,30,30,0.28)]")}>
            Add to Basket
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function HeroSection() {
  const heroSlides = homeContent.sliderImages;
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  function goToSlide(index) {
    setActiveSlide(index);
  }

  function goToPrevious() {
    setActiveSlide((current) => (current === 0 ? heroSlides.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  }

  return (
    <section className="hero-shell">
      <div className="mx-auto grid w-full max-w-[1260px] gap-10 px-4 py-10 lg:grid-cols-[1.04fr_0.96fr] lg:px-6 lg:py-16">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/14 px-4 py-2 text-sm font-medium text-white/88 backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            Perfect for leftover turkey, chicken, vegetables & family meals
          </motion.div>
          <motion.h1 variants={fadeInUp} className="mt-6 max-w-xl text-5xl font-semibold leading-[1.02] text-white md:text-6xl">
            Restaurant-Style Curry Sauces, Ready for Your Kitchen
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-5 max-w-xl text-lg leading-8 text-white/78">
            Cook your meat or vegetables, add Meah&apos;s Curry Sauce, and enjoy authentic curry flavour at home with chilled delivery across the UK mainland.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4">
            <Link href="/shop" className="primary-button bg-white text-[color:var(--theme-primary)] shadow-[0_18px_38px_rgba(255,255,255,0.18)]">
              Shop Sauces
            </Link>
            <Link href="/recipes" className="secondary-button border-white/26 bg-white/10 text-white">
              Explore Recipes
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              "47+ Years Experience",
              "Hand-Made Sauces",
              "Serves 4",
              "UK Delivery",
            ].map((badge) => (
              <div key={badge} className="rounded-[22px] border border-white/18 bg-white/10 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur-md">
                {badge}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={scaleIn} className="relative">
          <div className="absolute -left-4 top-12 h-24 w-24 rounded-full bg-[#F5A623]/24 blur-2xl" />
          <div className="absolute bottom-4 right-4 h-28 w-28 rounded-full bg-[#2E7D32]/20 blur-2xl" />

          {[
            { label: "Chilli", className: "left-[8%] top-[10%]", rotate: -8 },
            { label: "Garlic", className: "right-[8%] top-[14%]", rotate: 6 },
            { label: "Coriander", className: "left-[4%] bottom-[16%]", rotate: -4 },
            { label: "Steam", className: "right-[6%] bottom-[10%]", rotate: 5 },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              animate={{ y: [0, -14, 0], rotate: [item.rotate, item.rotate + 3, item.rotate] }}
              transition={{ duration: 5 + index, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className={cn("absolute z-10 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-medium text-white backdrop-blur-md", item.className)}
            >
              {item.label}
            </motion.div>
          ))}

          <div className="relative overflow-hidden rounded-[38px] border border-white/18 bg-white/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <div className="rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0.08))] p-4">
              <div className="carousel relative w-full overflow-hidden rounded-[26px]">
                <div className="hidden lg:block">
                  <div
                    className="flex w-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                  >
                    {heroSlides.map((slide, index) => {
                      const secondarySlide = heroSlides[(index + 1) % heroSlides.length];

                      return (
                        <div
                          key={`desktop-${slide}`}
                          className="carousel-item relative w-full shrink-0"
                          aria-hidden={activeSlide !== index}
                        >
                          <div className="grid w-full gap-4 lg:grid-cols-[0.68fr_0.32fr]">
                            <div className="relative min-h-[420px] overflow-hidden rounded-[26px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),rgba(255,255,255,0.3)_55%,transparent_100%)]">
                              <Image
                                src={slide}
                                alt={`Meah's curry sauce feature ${index + 1}`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                priority={index === 0}
                                className="object-cover drop-shadow-[0_28px_42px_rgba(0,0,0,0.22)]"
                              />
                            </div>
                            <div className="relative min-h-[420px] overflow-hidden rounded-[26px]">
                              <Image
                                src={secondarySlide}
                                alt={`Meah's curry sauce preview ${index + 2 > heroSlides.length ? 1 : index + 2}`}
                                fill
                                sizes="(max-width: 1024px) 100vw, 22vw"
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:hidden">
                  <div
                    className="flex w-full transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                  >
                    {heroSlides.map((slide, index) => (
                      <div
                        key={`mobile-${slide}`}
                        className="carousel-item relative w-full shrink-0"
                        aria-hidden={activeSlide !== index}
                      >
                        <div className="relative min-h-[320px] overflow-hidden rounded-[26px]">
                          <Image
                            src={slide}
                            alt={`Meah's curry sauce mobile slide ${index + 1}`}
                            fill
                            sizes="100vw"
                            priority={index === 0}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-5 flex items-center justify-between px-4">
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="btn btn-circle btn-sm border-white/20 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
                    aria-label="Previous hero slide"
                  >
                    ❮
                  </button>
                  <div className="flex gap-2">
                    {heroSlides.map((_, index) => (
                      <button
                        key={`hero-dot-${index + 1}`}
                        type="button"
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to hero slide ${index + 1}`}
                        className={cn(
                          "h-2.5 w-2.5 rounded-full border border-white/40 transition",
                          activeSlide === index ? "bg-white" : "bg-white/25"
                        )}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="btn btn-circle btn-sm border-white/20 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
                    aria-label="Next hero slide"
                  >
                    ❯
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="curved-divider" />
    </section>
  );
}

export function ProductShowcaseSection({ compact = false }) {
  const [search, setSearch] = useState("");
  const [heat, setHeat] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 550);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    return featuredProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesHeat = heat === "All" ? true : product.heatLabel === heat;
      return matchesSearch && matchesHeat;
    });
  }, [heat, search]);

  function handleAdd(slug) {
    addItem(slug, 1);
    openCart();
  }

  return (
    <Section
      id="products"
      eyebrow="Signature range"
      title="Our Signature Curry Sauces"
      description="Made with traditional spices and fresh produce. Just cook, pour, simmer, and serve."
      className={compact ? "pt-10" : "pt-20"}
    >
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3 rounded-full border border-[color:var(--theme-border)] bg-white/70 px-4 py-3 shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
          <Search className="h-4 w-4 text-[color:var(--theme-muted)]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search sauces by name"
            className="w-full bg-transparent text-sm text-[color:var(--theme-foreground)] outline-none placeholder:text-[color:var(--theme-muted)]/70"
          />
        </div>
        <div className="inline-flex flex-wrap gap-2">
          {["All", "Mild", "Medium", "Hot"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setHeat(option)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                heat === option
                  ? "border-[color:var(--theme-secondary)] bg-[linear-gradient(135deg,var(--theme-secondary),var(--theme-gradientTo))] text-[color:var(--theme-foreground)] shadow-[0_14px_30px_rgba(245,166,35,0.24)]"
                  : "border-[color:var(--theme-border)] bg-white/65 text-[color:var(--theme-foreground)] hover:border-[color:var(--theme-secondary)]/50 hover:bg-[color:var(--theme-surface)]"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-[30px] border border-[color:var(--theme-border)] bg-white/55 p-5">
              <div className="h-32 rounded-[22px] bg-black/6" />
              <div className="mt-4 h-5 w-1/2 rounded-full bg-black/8" />
              <div className="mt-3 h-4 w-full rounded-full bg-black/6" />
              <div className="mt-2 h-4 w-4/5 rounded-full bg-black/6" />
              <div className="mt-6 h-11 rounded-full bg-black/8" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length ? (
            <motion.div
              key={`${heat}-${search || "all"}`}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="hidden gap-5 md:grid md:grid-cols-2 xl:grid-cols-3"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} onAdd={handleAdd} featured={product.badge === "Best Seller"} />
              ))}
            </motion.div>
          ) : (
            <div className="hidden rounded-[28px] border border-dashed border-[color:var(--theme-border)] bg-white/55 px-6 py-12 text-center md:block">
              <p className="text-xl font-semibold text-[color:var(--theme-foreground)]">No sauces match this filter</p>
              <p className="mt-2 text-sm text-[color:var(--theme-muted)]">Try another spice level or clear the search term.</p>
            </div>
          )}

          {filteredProducts.length ? (
            <div className="md:hidden">
              <Swiper modules={[Pagination]} slidesPerView={1.08} spaceBetween={16} pagination={{ clickable: true }}>
                {filteredProducts.map((product) => (
                  <SwiperSlide key={product.slug}>
                    <ProductCard product={product} onAdd={handleAdd} featured={product.badge === "Best Seller"} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-[color:var(--theme-border)] bg-white/55 px-6 py-10 text-center md:hidden">
              <p className="text-lg font-semibold text-[color:var(--theme-foreground)]">No sauces match this filter</p>
              <p className="mt-2 text-sm text-[color:var(--theme-muted)]">Try another spice level or clear the search term.</p>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

export function BundlePricingSection() {
  return (
    <Section
      eyebrow="Order bundles"
      title="Batch pricing built for family dinners and stock-ups"
      description="Postage and packing included. Chilled product: refrigerate after delivery. Delivery only in batches of 6 or 12."
      className="pt-20"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {bundleOptions.map((bundle, index) => (
          <motion.article
            key={bundle.id}
            variants={index === 0 ? slideInLeft : slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="relative overflow-hidden rounded-[34px] border border-[color:var(--theme-border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,255,255,0.46))] p-7 shadow-[0_20px_45px_rgba(0,0,0,0.07)]"
          >
            {bundle.badge ? <span className="pill-badge absolute right-6 top-6 bg-[color:var(--theme-primary)] text-white">{bundle.badge}</span> : null}
            <p className="section-eyebrow">{bundle.title}</p>
            <h3 className="mt-4 text-4xl font-semibold text-[color:var(--theme-foreground)]">{bundle.quantity} Sauces</h3>
            <div className="mt-4 text-5xl font-semibold text-[color:var(--theme-primary)]">
              £<CountUp end={bundle.price} decimals={2} duration={1.6} />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[color:var(--theme-muted)]">{bundle.description}</p>
            <Link href="/shop" className="primary-button mt-8 inline-flex">
              Build this pack
            </Link>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { icon: Beef, title: "Cook your meat or vegetables", copy: "Start with chicken, lamb, prawns, paneer, or vegetables in your own pan." },
    { icon: Soup, title: "Add Meah’s Curry Sauce", copy: "Pour in the chilled sauce and let the hand-made spice blend coat every bite." },
    { icon: UtensilsCrossed, title: "Simmer, serve, and enjoy", copy: "Finish with rice, naan, or salad and enjoy authentic restaurant-style flavour at home." },
  ];

  return (
    <Section eyebrow="How it works" title="Three steps from pan to proper curry night" className="pt-20">
      <div className="relative grid gap-6 lg:grid-cols-3">
        <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-12 hidden h-px bg-[linear-gradient(90deg,transparent,var(--theme-primary),transparent)] lg:block" />
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <motion.article key={step.title} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative rounded-[28px] border border-[color:var(--theme-border)] bg-white/65 p-6 text-center shadow-[0_16px_34px_rgba(0,0,0,0.06)]">
              <motion.div whileHover={{ y: -6 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--theme-primary),var(--theme-gradientVia))] text-white shadow-[0_18px_30px_rgba(0,0,0,0.14)]">
                <Icon className="h-8 w-8" />
              </motion.div>
              <h3 className="mt-5 text-2xl font-semibold text-[color:var(--theme-foreground)]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--theme-muted)]">{step.copy}</p>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}

export function HeritageStorySection() {
  return (
    <Section
      id="heritage"
      eyebrow="Restaurant heritage"
      title="Over 47 Years of Restaurant Experience"
      description="Meah’s Curry Sauces were created from decades of restaurant experience and customer demand for authentic curry flavours at home."
      className="pt-20"
    >
      <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative min-h-[460px] overflow-hidden rounded-[34px]">
          <Image
            src={heritageContent.images[0]}
            alt="Meah's restaurant heritage"
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(19,12,8,0.55))]" />
        </motion.div>

        <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[34px] border border-[color:var(--theme-border)] bg-white/70 p-7 shadow-[0_20px_46px_rgba(0,0,0,0.07)]">
          <div className="space-y-4">
            {heritageContent.paragraphs.map((paragraph) => (
              <p key={paragraph} className="section-copy">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {storyStats.map((stat) => (
              <div key={stat.label} className="rounded-[24px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/70 p-5">
                <p className="text-4xl font-semibold text-[color:var(--theme-primary)]">
                  <CountUp end={stat.value} duration={1.8} />{stat.suffix}
                </p>
                <p className="mt-2 text-sm text-[color:var(--theme-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export function ProductDetailsPreviewSection() {
  return (
    <Section eyebrow="Sauce details" title="Flavour notes, storage, and recipe inspiration" className="pt-20">
      <div className="rounded-[32px] border border-[color:var(--theme-border)] bg-white/72 p-3 shadow-[0_16px_42px_rgba(0,0,0,0.06)]">
        <Tabs
          items={productDetailsTabs.map(({ key, label, product }) => ({
            key,
            label,
            children: (
              <div className="grid gap-6 p-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[280px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),rgba(255,255,255,0.48)_55%,transparent_100%)]">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-contain p-6"
                  />
                </div>
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--theme-muted)]">{product.heatLabel} heat</p>
                    <h3 className="mt-2 text-3xl font-semibold text-[color:var(--theme-foreground)]">{product.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--theme-muted)]">{product.description}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/70 p-4">
                      <p className="text-sm font-semibold text-[color:var(--theme-foreground)]">Recipe idea</p>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--theme-muted)]">{product.recipeIdea || `${product.recipeTitle} with rice and coriander.`}</p>
                    </div>
                    <div className="rounded-[24px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/70 p-4">
                      <p className="text-sm font-semibold text-[color:var(--theme-foreground)]">Storage</p>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--theme-muted)]">{product.storage}</p>
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/70 p-4">
                    <p className="text-sm font-semibold text-[color:var(--theme-foreground)]">Nutrition summary</p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--theme-muted)]">{product.nutritionPer100g}</p>
                  </div>
                  <div className="rounded-[24px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)]/70 p-4">
                    <p className="text-sm font-semibold text-[color:var(--theme-foreground)]">Allergens note</p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--theme-muted)]">{product.ingredientsAllergens}</p>
                  </div>
                </div>
              </div>
            ),
          }))}
        />
      </div>
    </Section>
  );
}

export function EventsSection({ compact = false }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <Section
      id="events"
      eyebrow="Markets and food shows"
      title="Meet Us at Local Markets & Food Festivals"
      description="Find Meah’s Curry Sauces at farmers markets and food festivals across the UK. Meet the team, sample sauces, and get recipe ideas."
      className={compact ? "pt-10" : "pt-20"}
    >
      <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
        {eventsContent.galleryImages.slice(0, 8).map((imageUrl, index) => (
          <motion.button
            key={imageUrl}
            type="button"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            whileHover={{ rotate: index % 2 === 0 ? 1.2 : -1.2, scale: 1.02 }}
            onClick={() => setSelectedImage(imageUrl)}
            className={cn(
              "relative overflow-hidden rounded-[28px]",
              index % 5 === 0 ? "xl:col-span-2 xl:row-span-2 min-h-[380px]" : "min-h-[240px]"
            )}
          >
            <Image src={imageUrl} alt={`Market gallery ${index + 1}`} fill sizes="(max-width: 1024px) 100vw, 25vw" className="object-cover transition duration-500 hover:scale-110" />
          </motion.button>
        ))}
      </div>

      <div className="md:hidden">
        <Swiper modules={[Pagination]} slidesPerView={1.1} spaceBetween={14} pagination={{ clickable: true }}>
          {eventsContent.galleryImages.slice(0, 8).map((imageUrl, index) => (
            <SwiperSlide key={imageUrl}>
              <button type="button" onClick={() => setSelectedImage(imageUrl)} className="relative block min-h-[280px] overflow-hidden rounded-[28px]">
                <Image src={imageUrl} alt={`Market gallery ${index + 1}`} fill sizes="90vw" className="object-cover" />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {selectedImage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(16,10,7,0.76)] p-4 backdrop-blur-md">
          <button type="button" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white" onClick={() => setSelectedImage(null)}>
            <X className="h-4 w-4" />
          </button>
          <div className="relative h-[72vh] w-full max-w-5xl overflow-hidden rounded-[32px]">
            <Image src={selectedImage} alt="Expanded market image" fill sizes="100vw" className="object-cover" />
          </div>
        </div>
      ) : null}
    </Section>
  );
}

export function RecipesSection({ compact = false }) {
  return (
    <Section
      id="recipes"
      eyebrow="Recipe ideas"
      title="Simple dishes that start with one chilled sauce jar"
      description="Placeholder recipe inspirations designed around the current Meah’s range."
      className={compact ? "pt-10" : "pt-20"}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <motion.article key={recipe.id} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} className="overflow-hidden rounded-[30px] border border-[color:var(--theme-border)] bg-white/72 shadow-[0_16px_36px_rgba(0,0,0,0.06)]">
            <div className="relative h-56 overflow-hidden">
              <Image src={recipe.imageUrl} alt={recipe.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-500 hover:scale-105" />
            </div>
            <div className="p-5">
              <span className="pill-badge">{recipe.sauce}</span>
              <h3 className="mt-4 text-2xl font-semibold text-[color:var(--theme-foreground)]">{recipe.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--theme-muted)]">{recipe.description}</p>
              <div className="mt-5 flex gap-4 text-sm text-[color:var(--theme-muted)]">
                <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" /> {recipe.prepTime}</span>
                <span className="inline-flex items-center gap-2"><Leaf className="h-4 w-4" /> Serves {recipe.serves}</span>
              </div>
              <Link href="/shop" className="secondary-button mt-5 w-full justify-center">
                View Recipe
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

export function DeliverySection() {
  const icons = [Truck, Clock3, PackageCheck, MapPinned];

  return (
    <Section id="delivery" eyebrow="Delivery information" title="Chilled delivery guidance before you order" className="pt-20">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {deliveryRules.map((rule, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.article key={rule.title} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[28px] border border-[color:var(--theme-border)] bg-white/70 p-6 shadow-[0_14px_30px_rgba(0,0,0,0.05)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--theme-secondary),var(--theme-gradientVia))] text-[color:var(--theme-foreground)]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[color:var(--theme-foreground)]">{rule.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--theme-muted)]">{rule.description}</p>
            </motion.article>
          );
        })}
      </div>
      <div className="mt-6 rounded-[28px] border border-[color:var(--theme-border)] bg-[color:var(--theme-primary)] px-6 py-5 text-white shadow-[0_18px_34px_rgba(139,30,30,0.18)]">
        Sauces are delivered only in batches of 6 or 12.
      </div>
    </Section>
  );
}

export function ContactSection() {
  return (
    <Section
      id="contact"
      eyebrow="Get in touch"
      title="Trade enquiries, feedback, and delivery questions"
      description="Contact Meah’s Flavours of India Ltd directly for home orders, wholesale supply, and product support."
      className="pt-20"
    >
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[34px] border border-[color:var(--theme-border)] bg-[linear-gradient(160deg,var(--theme-primary),var(--theme-gradientVia))] p-7 text-white shadow-[0_20px_48px_rgba(0,0,0,0.16)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">{brand.companyName}</p>
          <h3 className="mt-3 text-3xl font-semibold">Speak to the team</h3>
          <div className="mt-8 space-y-5 text-sm leading-7 text-white/82">
            <p>{brand.phone}</p>
            <p>{brand.email}</p>
            <p>{brand.address}</p>
          </div>
          <div className="mt-8 overflow-hidden rounded-[26px] border border-white/12 bg-white/10 p-4">
            <div className="map-placeholder min-h-[220px] rounded-[20px]">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm text-white">
                <MapPinned className="h-4 w-4" />
                Luton, Bedfordshire
              </span>
            </div>
          </div>
        </div>

        <motion.form initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.14 }} variants={staggerContainer} className="rounded-[34px] border border-[color:var(--theme-border)] bg-white/72 p-7 shadow-[0_18px_46px_rgba(0,0,0,0.06)]">
          <div className="grid gap-5 md:grid-cols-2">
            <motion.label variants={fadeInUp} className="field-shell">
              <span>Name</span>
              <input type="text" placeholder="Your name" className="field-input" />
            </motion.label>
            <motion.label variants={fadeInUp} className="field-shell">
              <span>Email</span>
              <input type="email" placeholder="you@example.com" className="field-input" />
            </motion.label>
          </div>
          <motion.label variants={fadeInUp} className="field-shell mt-5">
            <span>Enquiry type</span>
            <select className="field-input">
              <option>General enquiry</option>
              <option>Trade enquiry</option>
              <option>Feedback</option>
            </select>
          </motion.label>
          <motion.label variants={fadeInUp} className="field-shell mt-5">
            <span>Message</span>
            <textarea rows={6} placeholder="Tell us how we can help." className="field-input min-h-[180px] resize-none py-4" />
          </motion.label>
          <motion.button variants={fadeInUp} type="submit" className="primary-button mt-6 inline-flex items-center gap-2">
            Send Enquiry
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.form>
      </div>
    </Section>
  );
}

export function StoryStrip() {
  return (
    <Section className="pt-20">
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          { title: "Wholesale ready", copy: "Consistent chilled supply for shops, delis, caterers, and market stalls.", icon: ShoppingBasket },
          { title: "Made for home cooks", copy: "Restaurant-style results without sourcing a full spice cupboard.", icon: Soup },
          { title: "Fresh local produce", copy: "Traditional spices and local ingredients in a premium family-friendly range.", icon: Leaf },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <motion.article key={item.title} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[28px] border border-[color:var(--theme-border)] bg-white/70 p-6 shadow-[0_14px_30px_rgba(0,0,0,0.06)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--theme-surface)] text-[color:var(--theme-primary)]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-[color:var(--theme-foreground)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--theme-muted)]">{item.copy}</p>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}

export function PageHero({ eyebrow, title, description, imageUrl, actions = [] }) {
  return (
    <section className="mx-auto mt-8 grid w-full max-w-[1260px] gap-6 px-4 lg:grid-cols-[1fr_0.92fr] lg:px-6">
      <div className="rounded-[34px] border border-[color:var(--theme-border)] bg-[linear-gradient(135deg,var(--theme-primary),var(--theme-gradientVia),var(--theme-gradientTo))] p-8 text-white shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">{eyebrow}</p>
        <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-white/80">{description}</p>
        {actions.length ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {actions.map((action) =>
              action.href ? (
                <Link key={action.label} href={action.href} className={action.primary ? "primary-button bg-white text-[color:var(--theme-primary)]" : "secondary-button border-white/24 bg-white/12 text-white"}>
                  {action.label}
                </Link>
              ) : null
            )}
          </div>
        ) : null}
      </div>
      <div className="relative min-h-[260px] overflow-hidden rounded-[34px] md:min-h-[360px]">
        <Image src={imageUrl} alt={title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
    </section>
  );
}

export function StickyMobileCta() {
  return (
    <div className="mobile-shop-cta lg:hidden">
      <Link href="/shop" className="primary-button w-full justify-center">
        Shop Now
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
