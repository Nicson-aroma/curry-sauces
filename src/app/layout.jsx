import { Geist_Mono, Philosopher } from "next/font/google";

import "./globals.css";
import { CartProvider } from "../components/cart-provider";
import SiteShell from "../components/site-shell";
import { StaffProvider } from "../components/staff-provider";
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
  metadataBase: new URL("https://www.curry-sauces.co.uk"),
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
          <StaffProvider>
            <CartProvider>
              <SiteShell>{children}</SiteShell>
            </CartProvider>
          </StaffProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
