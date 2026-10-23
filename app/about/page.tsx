import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "About",
  description:
    "ToolVerse is a small, independent utility platform: ten browser-based tools for PDFs, images, text, and data, built around clear limits and local processing.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ToolVerse",
    description:
      "Ten browser-based tools for PDFs, images, text, and data, built around clear limits and local processing.",
    url: "/about",
  },
};

const principles = [
  {
    title: "One job per tool",
    text: "A tool that claims to do everything usually does nothing well. ToolVerse has ten tools, each focused on a single task with a defined input and output.",
  },
  {
    title: "Local processing by default",
    text: "Files are processed in the browser whenever the browser can do the job. The privacy page documents exactly what that means, without vague marketing language.",
  },
  {
    title: "Limits stated before the work",
    text: "Maximum file sizes, supported formats, and known restrictions are listed on each tool page. Suprises at checkout or during processing waste time.",
  },
  {
    title: "Plain design, no hiding",
    text: "No fake testimonials, invented counts, or trust badges. The interface aims to earn trust with clear behavior, not decoration.",
  },
];

const stack = [
  ["Framework", "Next.js with the App Router and React"],
  ["Language", "TypeScript with strict type checking"],
  ["Styling", "Tailwind CSS and a custom design-token system"],
  ["PDF processing", "pdf-lib, loaded only in the PDF tools"],
  ["Data and images", "Canvas API, native JSON, TextEncoder/TextDecoder"],
  ["QR codes", "The open-source qrcode library, run locally"],
  ["Testing", "Vitest for logic and Playwright for end-to-end checks"],
];

export default function AboutPage() {
  return (
    <div className="shell">
      <Breadcrumbs items={[{ label: "About" }]} />
      <div className="page-head">
        <p className="eyebrow eyebrow--rust">About</p>
        <h1 className="page-head__title">Everyday tools, built carefully</h1>
        <p className="page-head__lede">
          ToolVerse is a small, independent utility platform. The idea is simple: common tasks — merging PDFs, shrinking
          an image, validating JSON — should be quick, clear, and free of dark patterns.
        </p>
      </div>

      <div className="detail-grid" style={{ paddingBottom: "2.5rem" }}>
        <div className="prose">
          <h2>Why it exists</h2>
          <p>
            Plenty of online tools work, but many of them feel like bait: pop-ups before the file is processed, limits
            revealed after you upload, a signup wall for what should be a one-time task. ToolVerse is an attempt to
            build the version of this that respects both the task and the person doing it.
          </p>
          <p>
            The tools are practical. PDF merging keeps page order and preserves image quality. Image compression exposes
            a real quality slider instead of an opaque “optimize” button. JSON validation reports the line and column of
            the first syntax error instead of just saying it failed.
          </p>

          <h2>How it is built</h2>
          <p>
            The architecture is deliberately straightforward: a static design system, a central tool registry that
            drives navigation and search, and one component per tool. Heavy libraries are loaded only when you actually
            open the tool that needs them, which keeps other pages fast.
          </p>
          <div className="table-wrap" style={{ marginTop: "1.25rem" }}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Part</th>
                  <th scope="col">Approach</th>
                </tr>
              </thead>
              <tbody>
                {stack.map(([part, detail]) => (
                  <tr key={part}>
                    <th scope="row" style={{ textAlign: "left", textTransform: "none", color: "var(--ink)" }}>
                      {part}
                    </th>
                    <td>{detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Where ToolVerse is going</h2>
          <p>
            The current scope is ten working tools across four categories. New tools are added only when they can be
            implemented honestly — meaning real processing, stated limits, and no fake result pages. Requests are
            welcome through <Link href="/contact">the contact page</Link>.
          </p>
        </div>

        <aside className="tool-sidebar">
          <div className="aside-card">
            <h2 className="aside-card__title">Principles</h2>
            <ul className="check-list" style={{ marginTop: "0.85rem" }}>
              {principles.map((principle) => (
                <li key={principle.title}>
                  <span>
                    <strong>{principle.title}.</strong> {principle.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="aside-card">
            <h2 className="aside-card__title">By the numbers</h2>
            <dl style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem", fontSize: "0.86rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <dt style={{ color: "var(--muted)" }}>Tools</dt>
                <dd style={{ margin: 0, fontWeight: 650 }}>10</dd>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <dt style={{ color: "var(--muted)" }}>Categories</dt>
                <dd style={{ margin: 0, fontWeight: 650 }}>4</dd>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <dt style={{ color: "var(--muted)" }}>Guides</dt>
                <dd style={{ margin: 0, fontWeight: 650 }}>3</dd>
              </div>
            </dl>
          </div>
          <div className="aside-card">
            <h2 className="aside-card__title">Useful links</h2>
            <ul className="related-list">
              <li>
                <Link href="/tools">
                  All tools <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  Privacy <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  Pricing <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  Contact <span aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
