import Link from "next/link";
import { formatDate } from "@/lib/format";
import { getArticleReadingMinutes, type Article } from "@/lib/blog";
import { getTool } from "@/lib/tools";
import { ToolIcon } from "./icons";

export function ArticleToolLinks({ toolSlugs }: { toolSlugs: Article["relatedToolSlugs"] }) {
  return (
    <ul className="related-list">
      {toolSlugs.map((slug) => {
        const tool = getTool(slug);
        if (!tool) return null;
        return (
          <li key={slug}>
            <Link href={tool.href}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <ToolIcon name={tool.icon} size={15} /> {tool.name}
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ArticleFootmatter({ article }: { article: Article }) {
  return (
    <dl style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem", fontSize: "0.86rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <dt style={{ color: "var(--muted)" }}>Reading time</dt>
        <dd style={{ margin: 0, fontWeight: 650 }}>{getArticleReadingMinutes(article)} min</dd>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <dt style={{ color: "var(--muted)" }}>Updated</dt>
        <dd style={{ margin: 0, fontWeight: 650 }}>{formatDate(article.updated)}</dd>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <dt style={{ color: "var(--muted)" }}>Topics</dt>
        <dd style={{ margin: 0, fontWeight: 650 }}>{article.tags.join(", ")}</dd>
      </div>
    </dl>
  );
}
