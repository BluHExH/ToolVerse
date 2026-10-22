import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArticleCard } from "@/components/article-card";
import { getSortedArticles } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical guides about PDF merging and splitting, JSON syntax, and browser-based file processing — written around the tools ToolVerse actually implements.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Guides | ToolVerse",
    description:
      "Practical guides about PDF merging and splitting, JSON syntax, and browser-based file processing.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const articles = getSortedArticles();
  return (
    <div className="shell">
      <Breadcrumbs items={[{ label: "Guides" }]} />
      <div className="page-head">
        <p className="eyebrow eyebrow--rust">Guides</p>
        <h1 className="page-head__title">Practical notes, not filler</h1>
        <p className="page-head__lede">
          Each guide covers a task one or more tools handle — with the details worth knowing before you start, and the
          limits worth expecting.
        </p>
        <div className="page-head__meta">
          <span>{articles.length} guides</span>
          <span>Written for people who use tools, not for search engines</span>
        </div>
      </div>

      <div className="article-grid" style={{ paddingBottom: "2rem" }}>
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
