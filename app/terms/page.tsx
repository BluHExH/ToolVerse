import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The plain terms for using ToolVerse: what the site provides, your responsibilities, limits of liability, and what is not included.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms | ToolVerse",
    description: "The plain terms for using ToolVerse: what the site provides, your responsibilities, and limits.",
    url: "/terms",
  },
};

const lastUpdated = "October 19, 2026";

export default function TermsPage() {
  return (
    <div className="shell">
      <Breadcrumbs items={[{ label: "Terms" }]} />
      <div className="page-head">
        <p className="eyebrow eyebrow--rust">Terms</p>
        <h1 className="page-head__title">Using ToolVerse</h1>
        <p className="page-head__lede">
          Plain language for a simple product: what the site offers, what it does not promise, and what we expect from
          you.
        </p>
        <div className="page-head__meta">
          <span>Last updated {lastUpdated}</span>
        </div>
      </div>

      <div className="prose" style={{ paddingBottom: "3rem" }}>
        <h2>What this is</h2>
        <p>
          ToolVerse provides free browser tools for processing PDFs, images, text, and data. Use of the site is
          voluntary and free. There is no registration, subscription, or payment processing.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Do not use ToolVerse for content or files you have no right to process, do not attempt to circumvent
          documented file limits, and do not interfere with the operation of the site. Automated scraping or bulk
          abuse of the public pages is not a permitted use.
        </p>

        <h2>No warranty</h2>
        <p>
          The tools are provided “as is.” Processing happens in your browser with standard web APIs and third-party open
          source code, and results can be affected by the specific file you provide or the browser you use. Always check
          output — especially PDFs with legal or financial content — before relying on it.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          ToolVerse is not liable for lost files, missed deadlines, conversion errors, or downstream damage following
          use of the free tools. Nothing on this site is legal, financial, medical, or professional advice.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The ToolVerse name, design system, source code, and written guides belong to their creators and are protected.
          You retain ownership of whatever content you process through the tools; ToolVerse does not store it.
        </p>

        <h2>Changes</h2>
        <p>
          ToolVerse may change which tools are offered, adjust documented file limits, or update these terms. Significant
          changes to these terms will update the date above.
        </p>

        <h2>Governing concepts</h2>
        <p>
          Because ToolVerse is a simple web utility in which all processing is local, the meaningful “terms” are
          practical: use the site for legitimate purposes, verify results yourself, and do not depend on it as a sole
          copy of irreplaceable files.
        </p>
      </div>
    </div>
  );
}
