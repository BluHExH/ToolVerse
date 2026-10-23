import type { MetadataRoute } from "next";
import { getSortedArticles } from "@/lib/blog";
import { categories } from "@/lib/categories";
import { absoluteUrl } from "@/lib/site";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/tools",
    "/categories",
    "/blog",
    "/about",
    "/contact",
    "/pricing",
    "/privacy",
    "/terms",
  ];

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: absoluteUrl(tool.href),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/categories/${category.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = getSortedArticles().map((article) => ({
    url: absoluteUrl(`/blog/${article.slug}`),
    lastModified: new Date(article.updated),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...toolEntries, ...categoryEntries, ...articleEntries];
}
