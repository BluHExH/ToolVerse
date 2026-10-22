import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope/index.css";
import "@fontsource-variable/newsreader/index.css";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "ToolVerse — Everyday tools. One simple place.",
    template: "%s | ToolVerse",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "online tools",
    "PDF tools",
    "image tools",
    "JSON formatter",
    "Base64 encoder",
    "QR code generator",
    "word counter",
  ],
  authors: [{ name: "ToolVerse" }],
  creator: "ToolVerse",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "ToolVerse — Everyday tools. One simple place.",
    description: siteConfig.description,
    url: "/",
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolVerse — Everyday tools. One simple place.",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f2e9",
  colorScheme: "light",
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: "en",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
      </body>
    </html>
  );
}
