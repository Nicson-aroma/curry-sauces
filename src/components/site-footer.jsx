import Link from "next/link";
import { BadgeCheck, Camera, Mail, MapPin, Phone, Send } from "lucide-react";

import { brand, featuredProducts, navLinks } from "../lib/meahs-data";

const iconMap = {
  Facebook: BadgeCheck,
  Instagram: Camera,
  Twitter: Send,
};

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#1A120E] text-[#F8E6D4]">
      <div className="mx-auto grid max-w-[1260px] gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr] lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D9A625]">Meah&apos;s Sauces</p>
          <h2 className="mt-3 text-3xl font-semibold">Restaurant-style curry flavour without the restaurant bill.</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#E4C7AA]/72">
            Premium chilled sauces for family dinners, wholesale supply, market tastings, and home cooks who want authentic flavour fast.
          </p>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Newsletter email"
              className="h-12 flex-1 rounded-full border border-white/10 bg-white/6 px-4 text-sm text-white outline-none placeholder:text-[#E4C7AA]/45"
            />
            <button
              type="button"
              className="rounded-full bg-[#D9A625] px-5 py-3 text-sm font-semibold text-[#1A120E] transition hover:-translate-y-0.5"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#D9A625]">Quick links</p>
          <div className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm text-[#F8E6D4]/80 transition hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link href="/cart" className="block text-sm text-[#F8E6D4]/80 transition hover:text-white">
              Basket
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#D9A625]">Products</p>
          <div className="mt-5 space-y-3">
            {featuredProducts.slice(0, 6).map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="block text-sm text-[#F8E6D4]/80 transition hover:text-white">
                {product.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#D9A625]">Contact</p>
          <div className="mt-5 space-y-3 text-sm text-[#F8E6D4]/80">
            <p className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4" /> {brand.phone}</p>
            <p className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4" /> {brand.email}</p>
            <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4" /> {brand.address}</p>
          </div>
          <div className="mt-6 flex gap-3">
            {brand.socialLinks.map((social) => {
              const Icon = iconMap[social.name] ?? Send;
              return (
                <a
                  key={social.name}
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/6 transition hover:-translate-y-0.5 hover:bg-white/10"
                  aria-label={social.name}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1260px] flex-col gap-3 px-4 py-5 text-sm text-[#E4C7AA]/70 md:flex-row md:items-center md:justify-between lg:px-6">
          <p>© {new Date().getFullYear()} Meah&apos;s Flavours of India Ltd. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact">Cookie policy</Link>
            <Link href="/contact">Privacy policy</Link>
            <Link href="/contact">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
