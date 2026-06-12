import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const visitMapUrl =
  "https://www.google.com/maps/place/Komala+Vilas/@37.3531031,-122.0116365,15.64z/data=!4m6!3m5!1s0x808fb589fd36ead1:0x86106cdc3661185f!8m2!3d37.351395!4d-122.006376!16s%2Fg%2F1tf65qdg?entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D";

export const metadata: Metadata = {
  title: "Komala Vilas | South Indian Vegetarian Restaurant",
  description:
    "Komala Vilas serves South Indian vegetarian dosas, idli, thali, filter coffee, and more in Sunnyvale, California.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Komala Vilas home">
            <span className="brand-mark">க</span>
            <span>
              <span className="brand-name">Komala Vilas</span>
              <span className="brand-kicker">Sunnyvale · Est. South Indian</span>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            <Link href="/">Home</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/about">About</Link>
            <a href={visitMapUrl}>Visit</a>
            <a className="nav-order" href="https://komalavilas.com">
              Order Online
            </a>
          </nav>
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
                Traditional home-style South Indian vegetarian cooking in Sunnyvale.
                Breakfast to dinner, every day.
              </p>
              <span>கோமளா விலாஸ்</span>
            </div>
            <div>
              <strong>Explore</strong>
              <Link href="/">Home</Link>
              <Link href="/menu">Menu</Link>
              <Link href="/about">About</Link>
            </div>
            <div>
              <strong>Visit</strong>
              <p>
                1020 E El Camino Real
                <br />
                Sunnyvale, CA 94087
              </p>
              <a href="tel:+14087337400">(408) 733-7400</a>
              <a className="footer-order" href="https://komalavilas.com">
                Order Online
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Komala Vilas · Sunnyvale</span>
            <span>Pure vegetarian · Made fresh daily</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
