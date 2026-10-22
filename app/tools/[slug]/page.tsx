import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Laptop, ListChecks, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryIcon, ToolIcon } from "@/components/icons";
import { ToolRunner } from "@/components/tools/tool-runner";
import { getCategory } from "@/lib/categories";
import { absoluteUrl } from "@/lib/site";
import { getRelatedTools, getTool, tools } from "@/lib/tools";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) {
    return {};
  }
  const title = `${tool.name} — Free Browser Tool`;
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title,
      description: tool.description,
      url: `/tools/${tool.slug}`,
      type: "website",
    },
    twitter: {
      title,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) {
    notFound();
  }
  const category = getCategory(tool.category);
  const related = getRelatedTools(tool, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: absoluteUrl(tool.href),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any modern web browser",
    browserRequirements: "Requires JavaScript and a modern browser.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: tool.steps,
  };

  return (
    <div className="shell">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/tools" },
          ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
          { label: tool.name },
        ]}
      />

      <header className="tool-header">
        <div>
          <p
            className="eyebrow eyebrow--rust"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
          >
            <ToolIcon name={tool.icon} size={15} /> {category?.name}
          </p>
          <h1 className="tool-header__title">{tool.name}</h1>
          <p className="tool-header__desc">{tool.description}</p>
          <div className="tool-header__meta">
            <span>
              <Laptop size={15} aria-hidden="true" /> Runs in your browser
            </span>
            <span>
              <Download size={15} aria-hidden="true" /> Downloadable result
            </span>
            <span>
              <ListChecks size={15} aria-hidden="true" /> {tool.steps.length} clear steps
            </span>
          </div>
        </div>

        <div className="tool-facts" aria-label="Tool facts">
          <p className="tool-facts__title">At a glance</p>
          <div className="tool-facts__row">
            <span className="tool-facts__key">Category</span>
            <span className="tool-facts__value">{category?.name}</span>
          </div>
          <div className="tool-facts__row">
            <span className="tool-facts__key">Status</span>
            <span className="tool-facts__value" style={{ color: "var(--success)" }}>
              Available
            </span>
          </div>
          <div className="tool-facts__row">
            <span className="tool-facts__key">Processing</span>
            <span className="tool-facts__value">On your device</span>
          </div>
          <div className="tool-facts__row">
            <span className="tool-facts__key">Account needed</span>
            <span className="tool-facts__value">No</span>
          </div>
        </div>
      </header>

      <div className="tool-layout">
        <div>
          <ToolRunner slug={tool.slug} />
        </div>

        <aside className="tool-sidebar">
          <div className="aside-card">
            <h2 className="aside-card__title">How to use</h2>
            <ol>
              {tool.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="aside-card">
            <h2 className="aside-card__title">Related tools</h2>
            <ul className="related-list">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={item.href}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                      <ToolIcon name={item.icon} size={15} /> {item.name}
                    </span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section className="section" aria-labelledby="about-tool">
        <div className="detail-grid">
          <div>
            <p className="eyebrow">About this tool</p>
            <h2 className="section__title" id="about-tool" style={{ marginTop: "0.6rem" }}>
              What {tool.name} does
            </h2>
            <div className="prose" style={{ marginTop: "1.25rem" }}>
              <p>{tool.description}</p>
              <p>
                {tool.processing} Because the work happens locally, there is no upload step, no processing queue, and no
                server-side copy of your file to manage.
              </p>
              <h3>Limits worth knowing</h3>
              <ul>
                {tool.limits.map((limit) => (
                  <li key={limit}>{limit}</li>
                ))}
              </ul>
              <p>
                You can verify the local processing yourself: load this page, disconnect from the network, and run the
                tool. If it still works, nothing was being sent.
              </p>
            </div>
          </div>

          <div className="aside-card">
            <h2 className="aside-card__title">Processing and privacy</h2>
            <ul className="check-list" style={{ marginTop: "0.9rem" }}>
              <li>
                <ShieldCheck size={17} aria-hidden="true" />
                <span>
                  No file or text is uploaded. The tool uses browser APIs on this device.
                </span>
              </li>
              <li>
                <ShieldCheck size={17} aria-hidden="true" />
                <span>
                  Temporary preview URLs are released when they are no longer needed.
                </span>
              </li>
              <li>
                <ShieldCheck size={17} aria-hidden="true" />
                <span>
                  There is no account, no tracking script, and no storage of your input.{" "}
                  <Link href="/privacy">Read the privacy page</Link>.
                </span>
              </li>
            </ul>
            <p className="muted" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
              Need a different category?{" "}
              <Link href={`/categories/${tool.category}`} style={{ fontWeight: 700 }}>
                Browse {category?.name}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
