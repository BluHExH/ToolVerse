export type CategorySlug = "pdf" | "image" | "text" | "developer";

export interface CategoryDefinition {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: "file-text" | "image" | "type" | "code";
  accent: "rust" | "moss" | "ochre" | "slate";
}

export const categories: CategoryDefinition[] = [
  {
    slug: "pdf",
    name: "PDF Tools",
    description: "Merge and split documents without sending them anywhere.",
    icon: "file-text",
    accent: "rust",
  },
  {
    slug: "image",
    name: "Image Tools",
    description: "Compress, resize, and convert images right in the browser.",
    icon: "image",
    accent: "moss",
  },
  {
    slug: "text",
    name: "Text Tools",
    description: "Count, inspect, and understand the text you are working with.",
    icon: "type",
    accent: "ochre",
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Format, validate, and encode the data you handle every day.",
    icon: "code",
    accent: "slate",
  },
];

const categoryMap = new Map<CategorySlug, CategoryDefinition>(
  categories.map((category) => [category.slug, category]),
);

export function getCategory(slug: string): CategoryDefinition | undefined {
  return categoryMap.get(slug as CategorySlug);
}

export function requireCategory(slug: string): CategoryDefinition {
  const category = getCategory(slug);
  if (!category) {
    throw new Error(`Unknown category: ${slug}`);
  }
  return category;
}
