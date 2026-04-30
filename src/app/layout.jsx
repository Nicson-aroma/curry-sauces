import { Geist_Mono, Philosopher } from "next/font/google";

import "./globals.css";
import BackToTopButton from "../components/back-to-top-button";
import CartDrawer from "../components/cart-drawer";
import { CartProvider } from "../components/cart-provider";
import NewsletterPopup from "../components/newsletter-popup";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";
import { StickyMobileCta } from "../components/storefront-sections";
import ThemeSwitcher from "../components/theme-switcher";
import { ThemeProvider } from "../components/theme-provider";

const philosopher = Philosopher({
  variable: "--font-philosopher",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Meah's Curry Sauces",
  description:
    "Restaurant-style curry sauces for home cooking from Meah's Flavours of India Ltd.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${philosopher.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          <CartProvider>
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
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
