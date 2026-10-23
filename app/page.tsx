import Link from "next/link";
import { ArrowRight, MousePointer2, ShieldCheck, Upload } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { CategoryIcon, ToolIcon } from "@/components/icons";
import { ToolCard } from "@/components/tool-card";
import { ToolFinder } from "@/components/tool-finder";
import { getSortedArticles } from "@/lib/blog";
import { categories } from "@/lib/categories";
import { getCategoryCount, getFeaturedTools, tools } from "@/lib/tools";

const accentClass: Record<string, string> = {
  rust: "accent-rust",
  moss: "accent-moss",
  ochre: "accent-ochre",
  slate: "accent-slate",
};

export default function HomePage() {
  const featuredTools = getFeaturedTools();
  const guides = getSortedArticles();

  return (
    <>
      <section className="hero">
        <div className="hero__dots" aria-hidden="true" />
        <div className="shell hero__layout">
          <div>
            <p className="eyebrow eyebrow--rust">Everyday tools. One simple place.</p>
            <h1 className="hero__title">
              Small tasks, <em>handled well.</em>
            </h1>
            <p className="hero__lede">
              Merge a PDF, compress a photo, format JSON, or create a QR code. Focused tools that work in your
              browser — no account, no upload queue, no clutter.
            </p>

            <div className="hero__search">
              <ToolFinder placeholder="Try “merge PDF”, “compress image”, or “json”…" label="Find a tool" />
            </div>

            <div className="hero__quick">
              <span>Jump to:</span>
              <Link className="quick-chip" href="/tools/pdf-merger">
                Merge PDFs
              </Link>
              <Link className="quick-chip" href="/tools/image-compressor">
                Compress an image
              </Link>
              <Link className="quick-chip" href="/tools/json-formatter">
                Format JSON
              </Link>
              <Link className="quick-chip" href="/tools/qr-code-generator">
                Create a QR code
              </Link>
            </div>
          </div>

          <aside className="index-board on-dark" aria-label="Tool categories">
            <div className="index-board__head">
              <span className="index-board__kicker">Tool index</span>
              <span className="index-board__count">{tools.length} available</span>
            </div>
            <ul className="index-board__list">
              {categories.map((category, index) => (
                <li key={category.slug}>
                  <Link href={`/categories/${category.slug}`} className="index-board__link">
                    <span className="index-board__num">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="index-board__name">{category.name}</span>
                      <span className="index-board__desc" style={{ display: "block" }}>
                        {category.description}
                      </span>
                    </span>
                    <span className="index-board__meta">
                      {getCategoryCount(category.slug)}
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="index-board__note">
              <ShieldCheck size={16} aria-hidden="true" />
              Files and text stay on this device. ToolVerse processes them in the browser.
            </p>
          </aside>
        </div>
      </section>

      <section className="section section--flush" aria-labelledby="browse-heading">
        <div className="shell">
          <div className="section__head">
            <div>
              <p className="eyebrow">Browse</p>
              <h2 className="section__title" id="browse-heading">
                Find the right shelf
              </h2>
            </div>
            <Link href="/categories" className="link-arrow">
              All categories <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className={`category-row ${accentClass[category.accent]}`}
              >
                <span className="category-row__icon">
                  <CategoryIcon slug={category.slug} />
                </span>
                <span>
                  <span className="category-row__name">{category.name}</span>
                  <span className="category-row__desc" style={{ display: "block" }}>
                    {category.description}
                  </span>
                </span>
                <span className="category-row__count">
                  {getCategoryCount(category.slug)} tools <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tools-heading">
        <div className="shell">
          <div className="section__head">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="section__title" id="tools-heading">
                A useful place to begin
              </h2>
              <p className="section__lede">
                Six frequently used tools, each designed around a clear workflow with visible limits and a download at
                the end.
              </p>
            </div>
            <Link href="/tools" className="link-arrow">
              All {tools.length} tools <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="tool-grid">
            {featuredTools.map((tool, index) => (
              <ToolCard key={tool.slug} tool={tool} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="principles-heading">
        <div className="shell">
          <div className="principles on-dark">
            <div className="principles__head">
              <h2 className="principles__title" id="principles-heading">
                Built for quick, private work
              </h2>
              <p className="principles__lede">
                ToolVerse is designed around practical promises rather than a subscription funnel.
              </p>
            </div>
            <div className="principles__grid">
              <div className="principle">
                <span className="principle__num">01</span>
                <h3 className="principle__title">Stays on your device</h3>
                <p className="principle__text">
                  Files, text, and data are processed with browser APIs. ToolVerse does not send them to a server.
                </p>
              </div>
              <div className="principle">
                <span className="principle__num">02</span>
                <h3 className="principle__title">No account, no install</h3>
                <p className="principle__text">
                  Open a tool and use it. There is nothing to sign up for and no app to download.
                </p>
              </div>
              <div className="principle">
                <span className="principle__num">03</span>
                <h3 className="principle__title">Limits stated up front</h3>
                <p className="principle__text">
                  Each tool lists its file types, maximum sizes, and restrictions before you start working.
                </p>
              </div>
              <div className="principle">
                <span className="principle__num">04</span>
                <h3 className="principle__title">Comfortable on any screen</h3>
                <p className="principle__text">
                  Controls, previews, and downloads are designed to work on phones, tablets, and desktops.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="how-heading">
        <div className="shell">
          <div className="section__head">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="section__title" id="how-heading">
                From file to result
              </h2>
            </div>
          </div>
          <ol className="steps-list">
            <li>
              <span className="steps-list__num">Step 01</span>
              <p className="steps-list__title">Choose a tool</p>
              <p className="steps-list__text">
                Search by task or browse a category. Every tool page explains what the tool does and what it accepts.
              </p>
            </li>
            <li>
              <span className="steps-list__num">Step 02</span>
              <p className="steps-list__title">Add your file or text</p>
              <p className="steps-list__text">
                Use the file picker, drop a file onto the page, or paste text directly into the editor.
              </p>
            </li>
            <li>
              <span className="steps-list__num">Step 03</span>
              <p className="steps-list__title">Check and download</p>
              <p className="steps-list__text">
                Preview the result, compare sizes where relevant, and download or copy the output.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="guides-heading">
        <div className="shell">
          <div className="section__head">
            <div>
              <p className="eyebrow">Guides</p>
              <h2 className="section__title" id="guides-heading">
                Notes from the workbench
              </h2>
              <p className="section__lede">
                Short, practical explanations of the tasks these tools handle — and the details worth knowing.
              </p>
            </div>
            <Link href="/blog" className="link-arrow">
              All guides <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="article-grid">
            {guides.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="assurance-heading">
        <div className="shell">
          <div className="callout" style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <ShieldCheck size={20} aria-hidden="true" style={{ color: "var(--moss)" }} />
              <h2 className="callout__title" id="assurance-heading">
                You can check the privacy claim yourself
              </h2>
            </div>
            <p className="callout__text">
              Open any file tool, load the page, then disconnect from the network and process a file. Local processing
              keeps working because nothing was being sent. Limits and format support are documented on each tool page.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              <span className="chip">
                <MousePointer2 size={14} aria-hidden="true" /> No sign-up
              </span>
              <span className="chip">
                <Upload size={14} aria-hidden="true" /> No upload
              </span>
              <span className="chip">
                <ToolIcon name="badge-check" size={14} /> Working tools
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
