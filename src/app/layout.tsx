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
  metadataBase: new URL("https://sendnetworkiowa.org"),
  title: "Send Network Iowa",
  description:
    "Planting gospel-centered churches in every Iowa community. Send Network Iowa equips, coaches, and sends church planters across the state.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${libreBaskerville.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Send Network Iowa",
                url: "https://sendnetworkiowa.org",
                logo: "https://sendnetworkiowa.org/images/brand/sni-logo-white.png",
                description:
                  "Planting gospel-centered churches in every Iowa community through the Southern Baptist Convention.",
                parentOrganization: {
                  "@type": "Organization",
                  name: "North American Mission Board",
                  url: "https://www.namb.net",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Send Network Iowa",
                url: "https://sendnetworkiowa.org",
              },
            ]),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <NavHeader />

        {/* Page content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-brand-navy text-white/70">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

{/* NAMB credit */}
              <div className="flex items-end">
                <p className="text-xs text-white/60">
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
