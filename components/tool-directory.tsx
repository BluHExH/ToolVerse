"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { categories, getCategory, type CategorySlug } from "@/lib/categories";
import { searchTools } from "@/lib/search";
import { tools, type ToolDefinition } from "@/lib/tools";
import { ToolCard } from "./tool-card";

type SortOption = "curated" | "name" | "category";

const sortLabels: Record<SortOption, string> = {
  curated: "Curated order",
  name: "Name (A–Z)",
  category: "Category",
};

export function ToolDirectory({ initialCategory }: { initialCategory?: CategorySlug }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategorySlug | "all">(initialCategory ?? "all");
  const [sort, setSort] = useState<SortOption>("curated");

  const results = useMemo(() => {
    const pool = category === "all" ? tools : tools.filter((tool) => tool.category === category);
    const searched = query.trim() ? searchTools(query, pool) : [...pool].sort((a, b) => a.order - b.order);

    if (sort === "name") {
      return [...searched].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "category") {
      return [...searched].sort(
        (a, b) => a.category.localeCompare(b.category) || a.order - b.order,
      );
    }
    return searched;
  }, [category, query, sort]);

  const hasFilters = query.trim().length > 0 || category !== "all";

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setSort("curated");
  };

  return (
    <div className="directory">
      <div className="directory__controls" id="tool-search">
        <div className="field directory__search">
          <label className="field__label" htmlFor="tool-search-input">
            Search tools
          </label>
          <Search size={17} aria-hidden="true" />
          <input
            id="tool-search-input"
            className="input"
            type="search"
            placeholder="Search by name, task, or keyword…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="tool-category-filter">
            Category
          </label>
          <select
            id="tool-category-filter"
            className="select"
            value={category}
            onChange={(event) => setCategory(event.target.value as CategorySlug | "all")}
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="tool-sort">
            Sort by
          </label>
          <select
            id="tool-sort"
            className="select"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
          >
            {(Object.keys(sortLabels) as SortOption[]).map((option) => (
              <option key={option} value={option}>
                {sortLabels[option]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="directory__count">
        <span role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "tool" : "tools"}
          {category !== "all" ? ` in ${getCategory(category)?.name}` : ""}
        </span>
        {hasFilters ? (
          <button type="button" className="btn btn--quiet btn--sm" onClick={clearFilters}>
            <X size={14} aria-hidden="true" /> Clear filters
          </button>
        ) : null}
      </div>

      {results.length > 0 ? (
        <div className="tool-grid">
          {results.map((tool: ToolDefinition) => (
            <ToolCard key={tool.slug} tool={tool} index={tools.indexOf(tool)} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state__icon">
            <Search size={20} aria-hidden="true" />
          </span>
          <h2>No tools match those filters</h2>
          <p>
            Try a shorter search such as “pdf”, “image”, or “json”, or choose a different category.
          </p>
          <button type="button" className="btn btn--secondary" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
