import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryIcon, ToolIcon } from "@/components/icons";
import { categories } from "@/lib/categories";
import { getCategoryCount, getToolsByCategory } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tool Categories",
  description:
    "Browse ToolVerse tools by category: PDF tools, image tools, text tools, and developer tools. Every tool explains its limits before you begin.",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "Tool Categories | ToolVerse",
    description: "Browse ToolVerse tools by category: PDF, image, text, and developer tools.",
    url: "/categories",
  },
};

const accentClass: Record<string, string> = {
  rust: "accent-rust",
  moss: "accent-moss",
  ochre: "accent-ochre",
  slate: "accent-slate",
};

export default function CategoriesPage() {
  return (
    <div className="shell">
      <Breadcrumbs items={[{ label: "Categories" }]} />
      <div className="page-head">
        <p className="eyebrow eyebrow--rust">Categories</p>
        <h1 className="page-head__title">Browse by the task at hand</h1>
        <p className="page-head__lede">
          Four shelves, ten tools. Each category groups tools that solve the same kind of problem, with the same
          browser-based approach and clear limits.
        </p>
      </div>

      <div className="tool-grid" style={{ paddingBottom: "2rem" }}>
        {categories.map((category) => {
          const categoryTools = getToolsByCategory(category.slug);
          return (
            <section
              key={category.slug}
              className={`tool-card ${accentClass[category.accent]}`}
              aria-labelledby={`category-${category.slug}`}
            >
              <div className="tool-card__top">
                <span className="tool-card__icon">
                  <CategoryIcon slug={category.slug} size={21} />
                </span>
                <span className="tool-card__index">{getCategoryCount(category.slug)} tools</span>
              </div>
              <h2 className="tool-card__title" id={`category-${category.slug}`}>
                {category.name}
              </h2>
              <p className="tool-card__summary">{category.description}</p>
              <ul className="related-list">
                {categoryTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={tool.href}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <ToolIcon name={tool.icon} size={15} /> {tool.name}
                      </span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="tool-card__foot">
                <Link href={`/categories/${category.slug}`} className="tool-card__open">
                  View category <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
