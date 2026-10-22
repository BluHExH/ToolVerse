import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategory } from "@/lib/categories";
import type { ToolDefinition } from "@/lib/tools";
import { ToolIcon } from "./icons";

const accentClass: Record<string, string> = {
  rust: "accent-rust",
  moss: "accent-moss",
  ochre: "accent-ochre",
  slate: "accent-slate",
};

export function ToolCard({ tool, index }: { tool: ToolDefinition; index?: number }) {
  const category = getCategory(tool.category);
  const accent = accentClass[category?.accent ?? "rust"];

  return (
    <Link href={tool.href} className={`tool-card ${accent}`}>
      <div className="tool-card__top">
        <span className="tool-card__icon">
          <ToolIcon name={tool.icon} />
        </span>
        {typeof index === "number" ? (
          <span className="tool-card__index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>
      <h3 className="tool-card__title">{tool.name}</h3>
      <p className="tool-card__summary">{tool.summary}</p>
      <div className="tool-card__foot">
        <span className="tool-card__category">{category?.name}</span>
        <span className="tool-card__open">
          Open tool <ArrowRight size={15} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
