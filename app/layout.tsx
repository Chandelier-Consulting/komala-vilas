import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Manrope, Noto_Sans_Tamil } from "next/font/google";
import Link from "next/link";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { PrimaryNav } from "@/components/primary-nav";
import { restaurantInfo } from "@/lib/restaurant";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const tamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil"],
  weight: ["500", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Komala Vilas | South Indian Vegetarian Restaurant",
  description:
    "Komala Vilas serves South Indian vegetarian dosas, idli, thali, filter coffee, and catering in Sunnyvale, California.",
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${manrope.variable} ${tamil.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Komala Vilas home">
            <span className="brand-mark">க</span>
            <span>
              <span className="brand-name">{restaurantInfo.name}</span>
              <span className="brand-kicker">{restaurantInfo.tagline}</span>
            </span>
          </Link>
          <PrimaryNav />
        </header>
        {children}
        <footer className="footer">
          <div className="section-shell footer-grid">
            <div>
              <div className="footer-brand">
                <span className="brand-mark">க</span>
                <strong>Komala Vilas</strong>
              </div>
              <p>
                Traditional South Indian vegetarian cooking in Sunnyvale: dosa,
                thali, tiffin, filter coffee, and catered feasts.
              </p>
              <span>{restaurantInfo.tamilName}</span>
            </div>
            <div>
              <strong>Explore</strong>
              <Link href="/">Home</Link>
              <Link href="/menu">Menu</Link>
              <Link href="/catering">Catering</Link>
              <Link href="/about">About</Link>
            </div>
            <div>
              <strong>Visit</strong>
              <p>
                1020 E El Camino Real
                <br />
                Sunnyvale, CA 94087
              </p>
              <a href={restaurantInfo.phoneHref}>{restaurantInfo.phone}</a>
              <Link className="footer-order" href="/catering">
                Order Catering
              </Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Komala Vilas · Sunnyvale</span>
            <span>Pure vegetarian · Fermented daily · Served with refills</span>
          </div>
        </footer>
        <MobileActionBar />
      </body>
    </html>
  );
}
