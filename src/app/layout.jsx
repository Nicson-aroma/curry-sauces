import { Geist_Mono, Philosopher } from "next/font/google";

import "./globals.css";
import { CartProvider } from "../components/cart-provider";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

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
      data-theme="luxury"
      className={`${philosopher.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <CartProvider>
          <div className="site-frame">
            <div className="site-ornament site-ornament-left" aria-hidden="true" />
            <div className="site-ornament site-ornament-right" aria-hidden="true" />
            <SiteHeader />
            <div className="relative flex-1">{children}</div>
            <SiteFooter />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
