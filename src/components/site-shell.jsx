"use client";

import { usePathname } from "next/navigation";

import BackToTopButton from "./back-to-top-button";
import CartDrawer from "./cart-drawer";
import NewsletterPopup from "./newsletter-popup";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";
import { StickyMobileCta } from "./storefront-sections";
import ThemeSwitcher from "./theme-switcher";

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const isStaffRoute =
    pathname === "/admin" ||
    pathname.startsWith("/manager") ||
    pathname.startsWith("/admin/");

  if (isStaffRoute) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="site-frame">
      <SiteHeader />
      <div className="relative flex-1">{children}</div>
      <SiteFooter />
      <CartDrawer />
      <ThemeSwitcher />
      <NewsletterPopup />
      <BackToTopButton />
      <StickyMobileCta />
    </div>
  );
}
