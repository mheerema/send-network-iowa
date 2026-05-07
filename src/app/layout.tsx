import type { Metadata } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Send Network Iowa",
  description:
    "Planting gospel-centered churches in every Iowa community. Send Network Iowa equips, coaches, and sends church planters across the state.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/plant", label: "Plant" },
  { href: "/partner", label: "Partner" },
  { href: "/iowa", label: "Iowa" },
  { href: "/events", label: "Events" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${libreBaskerville.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {/* Navigation */}
        <header className="bg-brand-navy sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo / wordmark */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-white font-bold text-lg tracking-tight">
                  Send Network Iowa
                </span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* CTA */}
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-brand-amber text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Talk to Someone
              </Link>

              {/* Mobile menu placeholder */}
              <button
                className="md:hidden text-white/80 hover:text-white p-2"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-brand-navy text-white/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div>
                <p className="text-white font-bold text-base tracking-tight mb-2">
                  Send Network Iowa
                </p>
                <p className="text-sm leading-relaxed">
                  A church in every Iowa community. Planting, coaching, and
                  sending through the Southern Baptist Convention.
                </p>
              </div>

              {/* Nav links */}
              <div>
                <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
                  Pages
                </p>
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
                  Contact
                </p>
                <a
                  href="mailto:info@sendnetworkiowa.org"
                  className="text-sm hover:text-white transition-colors"
                >
                  info@sendnetworkiowa.org
                </a>
                <p className="text-xs mt-4 text-white/40">
                  A ministry of the North American Mission Board (NAMB).
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 mt-10 pt-6 text-xs text-white/40">
              &copy; {new Date().getFullYear()} Send Network Iowa. All rights
              reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
