import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PromoBanner from "@/components/PromoBanner";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | H-2A Agency for Family Farms`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: `${site.name} | H-2A Agency for Family Farms`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: `${site.name} | H-2A Agency for Family Farms`, description: site.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bitter:wght@500;700&family=Source+Sans+3:wght@400;600;700&display=swap"
        />
      </head>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "@id": `${site.url}/#org`,
            name: site.name,
            url: site.url,
            description: site.description,
            slogan: site.headline,
            areaServed: { "@type": "Country", name: "United States" },
            knowsAbout: ["H-2A visa program", "agricultural labor certification", "AEWR", "farm labor compliance"],
            serviceType: "H-2A visa agent services for agricultural employers",
          }}
        />
        <a href="#main" className="skip-link">Skip to content</a>
        <PromoBanner />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
