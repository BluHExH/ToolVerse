import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How ToolVerse handles files, text, and data: processing happens in your browser, there are no accounts or tracking scripts, and nothing is uploaded.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy | ToolVerse",
    description: "How ToolVerse handles files, text, and data. Local processing, no accounts, no tracking.",
    url: "/privacy",
  },
};

const lastUpdated = "October 19, 2026";

export default function PrivacyPage() {
  return (
    <div className="shell">
      <Breadcrumbs items={[{ label: "Privacy" }]} />
      <div className="page-head">
        <p className="eyebrow eyebrow--rust">Privacy</p>
        <h1 className="page-head__title">What actually happens to your data</h1>
        <p className="page-head__lede">
          This page describes the real behavior of the site, not aspirations. If a claim here ever stops matching the
          code, the page would be wrong — and the honest response is to fix it.
        </p>
        <div className="page-head__meta">
          <span>Last updated {lastUpdated}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <ShieldCheck size={15} aria-hidden="true" /> Local-first by architecture
          </span>
        </div>
      </div>

      <div className="prose" style={{ paddingBottom: "2rem" }}>
        <h2>Files, images, PDFs, and text</h2>
        <p>
          Every processing tool on ToolVerse runs entirely in your browser. When you add a file, the browser reads it
          from your disk into memory; merging, splitting, compression, resizing, conversion, encoding, and counting all
          happen in code running on your device. No tool uploads your file to a server.
        </p>
        <p>
          That also means nothing persists. Closing the tab discards the working data. Preview images and downloads are
          created with short-lived object URLs that are revoked when no longer needed. ToolVerse does not save your
          inputs, outputs, or history between visits, and has no database of your files.
        </p>

        <h2>What the browser knows locally</h2>
        <p>
          A standard browser session involves baseline technical data: your IP address is visible to the server serving
          static files, and your browser sends a user-agent string. ToolVerse adds no tracking scripts, analytics
          pixels, or fingerprinting on top of that. There are no cookies and no cross-site requests created by the site
          itself.
        </p>

        <h2>Accounts, cookies, and advertising</h2>
        <p>
          There is no authentication system on this site, so no account data exists. There is no cookie banner because
          ToolVerse does not set cookies. There is no advertising.
        </p>

        <h2>Contact form</h2>
        <p>
          The contact page composes a message in your browser. It never sends that message back to ToolVerse directly;
          you choose whether to open an email draft or copy the text. If a deployed instance is configured with a
          contact email address, that address is public in the page because it is used to open the draft — it is not a
          secret.
        </p>

        <h2>What other parties see</h2>
        <p>
          Fonts are self-hosted with this site, so loading a page does not fetch Google Fonts or other third-party
          resources. No social widgets are embedded. The QR code generator and Base64 encoder run offline after the page
          loads.
        </p>

        <h2>Children</h2>
        <p>
          ToolVerse is a general-audience utility site with no age restrictions, no registration, and no age-verification
          mechanism — because there is nothing to register for.
        </p>

        <h2>Changes</h2>
        <p>
          If the site's data handling changes, this page will be updated and the date above will change. That is the
          mechanism: the description here is meant to reflect reality, and reality is inspectable in the code.
        </p>

        <h2>Questions</h2>
        <p>
          If something here is unclear, use the <a href="/contact">contact page</a>. If the operators have configured a
          contact email for this deployment, it appears there; otherwise the form helps you compose a message outside
          the site.
        </p>
      </div>
      <p className="muted mono" style={{ fontSize: "0.8rem", paddingBottom: "3rem" }}>
        {siteConfig.tagline}
      </p>
    </div>
  );
}
