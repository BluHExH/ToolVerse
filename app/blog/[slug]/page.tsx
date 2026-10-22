import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleFootmatter } from "@/components/article-footmatter";
import { ArticleToolLinks } from "@/components/article-tool-links";
import { getArticle, getSortedArticles } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { getTool } from "@/lib/tools";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { getArticleReadingMinutes } from "@/lib/blog";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getSortedArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/blog/${article.slug}`,
      type: "article",
      publishedTime: article.updated,
      authors: [siteConfig.name],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    notFound();
  }

  const relatedTools = article.relatedToolSlugs
    .map((toolSlug) => getTool(toolSlug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    dateModified: article.updated,
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`),
    wordCount: getArticleReadingMinutes(article) * 200,
  };

  return (
    <article className="shell">
      <Breadcrumbs items={[{ label: "Guides", href: "/blog" }, { label: article.title }]} />
      <header className="page-head">
        <p className="eyebrow eyebrow--rust">
          {article.tags.join(" · ")} · {getArticleReadingMinutes(article)} min read
        </p>
        <h1 className="page-head__title">{article.title}</h1>
        <p className="page-head__lede">{article.description}</p>
        <div className="page-head__meta">
          <span>Last updated {formatDate(article.updated)}</span>
          <span>
            Related tools:{" "}
            {relatedTools.reduce<ReactNode[]>((nodes, tool, index) => {
              if (index > 0) nodes.push(" · ");
              nodes.push(
                <Link key={tool.slug} href={tool.href}>
                  {tool.name}
                </Link>,
              );
              return nodes;
            }, [])}
          </span>
        </div>
      </header>

      <div className="detail-grid" style={{ paddingBottom: "3rem" }}>
        <div className="prose">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {section.code ? <pre>{section.code}</pre> : null}
              {section.note ? (
                <blockquote>
                  <strong>Note:</strong> {section.note}
                </blockquote>
              ) : null}
            </section>
          ))}
        </div>

        <aside className="tool-sidebar">
          <div className="aside-card">
            <h2 className="aside-card__title">Tools used in this guide</h2>
            <ArticleToolLinks toolSlugs={article.relatedToolSlugs} />
          </div>
          <div className="aside-card">
            <h2 className="aside-card__title">On this page</h2>
            <ol>
              {article.sections.map((section) => (
                <li key={section.heading}>{section.heading}</li>
              ))}
            </ol>
          </div>
          <div className="aside-card">
            <h2 className="aside-card__title">Details</h2>
            <ArticleFootmatter article={article} />
          </div>
        </aside>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </article>
  );
}
