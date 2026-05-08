import type { Metadata } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import NavHeader from "@/components/NavHeader";
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

const footerLinks = [
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
        <NavHeader />

        {/* Page content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-brand-navy text-white/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div>
                <Image
                  src="/images/brand/sni-logo-white.png"
                  alt="Send Network Iowa"
                  width={160}
                  height={29}
                  className="h-7 w-auto mb-3"
                />
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
                  {footerLinks.map((link) => (
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
