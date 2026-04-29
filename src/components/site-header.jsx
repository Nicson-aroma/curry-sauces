"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";

import { Badge } from "./ui/badge";
import { useCart } from "./cart-provider";
import { brand, navLinks } from "../lib/meahs-data";

export default function SiteHeader() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-bar">
        <div className="site-brand">
          <Link href="/" className="site-brand-link" aria-label={brand.name}>
            <span className="site-logo-wrap">
              <Image
                src="/asset/logo.gif"
                alt={`${brand.name} logo`}
                width={210}
                height={76}
                priority
                className="site-logo"
              />
            </span>
            <span className="site-brand-text">
              <span className="site-eyebrow">The sauces with restaurant heritage</span>
              <span className="site-title">{brand.name}</span>
            </span>
          </Link>
        </div>

        <div className="site-meta">
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-expanded={isMenuOpen}
            aria-controls="site-navigation"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X className="h-5 w-5" strokeWidth={1.9} /> : <Menu className="h-5 w-5" strokeWidth={1.9} />}
          </button>
          <Link
            href="/cart"
            className="cart-nav-link"
            aria-label={`Open cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <span className="cart-nav-icon-wrap flex">
              <ShoppingCart className="h-5 w-5" strokeWidth={1.9} />
              <span className="cart-nav-badge ms-2">{itemCount}</span>
            </span>
          </Link>
        </div>
      </div>

      <nav
        id="site-navigation"
        className={`site-nav ${isMenuOpen ? "site-nav-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="mobile-nav-title">
          <p className="mobile-nav-title-eyebrow">The sauces with restaurant heritage</p>
          <p className="mobile-nav-title-text">{brand.name}</p>
        </div>
        <ul className="site-nav-list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="site-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <Badge variant="outline" className="nav-pill">
                  {link.label}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
