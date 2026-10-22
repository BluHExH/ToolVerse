import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryIcon } from "@/components/icons";
import { ToolDirectory } from "@/components/tool-directory";
import { categories, getCategory, type CategorySlug } from "@/lib/categories";
import { getCategoryCount, getToolsByCategory } from "@/lib/tools";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) {
    return {};
  }
  const count = getCategoryCount(category.slug);
  const description = `${category.description} ${count} browser-based ${
    count === 1 ? "tool" : "tools"
  } with clear limits and local processing.`;
  return {
    title: category.name,
    description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} | ToolVerse`,
      description,
      url: `/categories/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) {
    notFound();
  }

  const categoryTools = getToolsByCategory(category.slug as CategorySlug);

  return (
    <div className="shell">
      <Breadcrumbs
        items={[{ label: "Categories", href: "/categories" }, { label: category.name }]}
      />
      <div className="page-head">
        <p className="eyebrow eyebrow--rust" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
          <CategoryIcon slug={category.slug} size={15} /> Category
        </p>
        <h1 className="page-head__title">{category.name}</h1>
        <p className="page-head__lede">{category.description}</p>
        <div className="page-head__meta">
          <span>
            {categoryTools.length} {categoryTools.length === 1 ? "tool" : "tools"}
          </span>
          <span>
            Names: {categoryTools.map((tool) => tool.name).join(", ")}
          </span>
        </div>
      </div>

      <ToolDirectory initialCategory={category.slug} />
      <div style={{ height: "2rem" }} />
    </div>
  );
}
