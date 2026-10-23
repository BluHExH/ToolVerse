import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "ToolVerse is free to use. There are no accounts, subscriptions, or paid tiers — and no payment processing on this site.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | ToolVerse",
    description: "ToolVerse is free to use. No accounts, subscriptions, or payment processing.",
    url: "/pricing",
  },
};

const includedFeatures = [
  "All tools, with no usage caps beyond the documented file limits",
  "Local browser processing for files, images, text, and data",
  "No account creation, sign-up, or sign-in",
  "The complete tools directory, categories, and guides",
  "No payment details collected, anywhere on the site",
];

const notIncluded = [
  "Batch processing beyond the per-tool file limits",
  "Server-side processing for very large documents",
  "Accounts, saved history, or cloud storage of results",
  "API access for automated workflows",
];

const faqs = [
  {
    question: "Is ToolVerse really free?",
    answer:
      "Yes. Every tool on the site works without payment or registration. There is no premium tier and no trial that later requests a card.",
  },
  {
    question: "Why is there no payment system?",
    answer:
      "The tools run in your browser with no server-side processing costs, so charging for access would add friction without adding value. Payment processing is not implemented on this site.",
  },
  {
    question: "Do you require an account?",
    answer:
      "No. There is no authentication system at all. Open a tool and use it — nothing to sign up for, nothing stored about you between visits.",
  },
  {
    question: "What are the actual limits?",
    answer:
      "Each tool documents its own limits, such as 50 MB per PDF and 25 MB per image. These exist because processing happens on your device, and memory is finite. The limits are stated on each tool page before you begin.",
  },
  {
    question: "Could a paid version appear later?",
    answer:
      "If additional features ever required payment, that would be announced clearly on this page with a stated price before any payment flow existed. Nothing is sold today, and there is no checkout.",
  },
];

const toolRows = tools.slice(0, 6);

export default function PricingPage() {
  return (
    <div className="shell">
      <Breadcrumbs items={[{ label: "Pricing" }]} />
      <div className="page-head">
        <p className="eyebrow eyebrow--rust">Pricing</p>
        <h1 className="page-head__title">Free, and honestly so</h1>
        <p className="page-head__lede">
          Every tool on ToolVerse is free and needs no account. There is no payment processing here — this page exists to
          say that plainly and to explain what the free tools include and where their limits are.
        </p>
      </div>

      <div className="pricing-grid" style={{ paddingBottom: "2rem" }}>
        <section className="price-card price-card--feature" aria-labelledby="price-plan">
          <p className="eyebrow">Current plan</p>
          <h2 className="section__title" id="price-plan" style={{ marginTop: "0.5rem" }}>
            Free use, every tool
          </h2>
          <div className="price">
            <span className="price__value">$0</span>
            <span className="price__note">nothing to pay, now or later</span>
          </div>
          <ul className="check-list">
            {includedFeatures.map((feature) => (
              <li key={feature}>
                <Check size={17} aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1.5rem" }}>
            <Link href="/tools" className="btn btn--primary">
              Browse the tools
            </Link>
            <Link href="/privacy" className="btn btn--secondary">
              How data is handled
            </Link>
          </div>
        </section>

        <aside className="price-card">
          <p className="eyebrow">Not offered</p>
          <h2 className="section__title" style={{ marginTop: "0.5rem", fontSize: "1.4rem" }}>
            What does not exist here
          </h2>
          <ul className="check-list">
            {notIncluded.map((item) => (
              <li key={item}>
                <Minus size={17} aria-hidden="true" style={{ color: "var(--muted)" }} />
                <span style={{ color: "var(--muted)" }}>{item}</span>
              </li>
            ))}
          </ul>
          <p className="muted" style={{ fontSize: "0.85rem", marginTop: "1.25rem" }}>
            If a tool you need is beyond these limits, the honest options are a paid service with publishable data
            practices, or local software. ToolVerse will never quietly fill the gap with a paid backend.
          </p>
        </aside>
      </div>

      <section className="section" aria-labelledby="limits-heading">
        <div className="section__head">
          <div>
            <p className="eyebrow">Free in practice</p>
            <h2 className="section__title" id="limits-heading">
              What each tool costs to use
            </h2>
          </div>
          <Link href="/tools" className="link-arrow">
            Open the directory
          </Link>
        </div>
        <div className="table-wrap">
          <table>
            <caption className="sr-only">ToolVerse tools and their usage limits</caption>
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">Category</th>
                <th scope="col">Cost</th>
                <th scope="col">Account</th>
                <th scope="col">Where it processes</th>
              </tr>
            </thead>
            <tbody>
              {toolRows.map((tool) => (
                <tr key={tool.slug}>
                  <td>
                    <Link href={tool.href} style={{ fontWeight: 700 }}>
                      {tool.name}
                    </Link>
                  </td>
                  <td>{tool.category}</td>
                  <td>Free</td>
                  <td>None</td>
                  <td>Your browser</td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} className="muted">
                  The remaining tools are listed on the <Link href="/tools">tools page</Link> — all free, all local.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-heading">
        <div className="section__head">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="section__title" id="faq-heading">
              Pricing questions, answered plainly
            </h2>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <div className="faq-item" key={faq.question}>
              <h3 className="faq-item__question">{faq.question}</h3>
              <p className="faq-item__answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
