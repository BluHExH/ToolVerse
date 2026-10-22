import { getCategory } from "./categories";
import type { ToolDefinition } from "./tools";

export function normalizeSearchValue(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreTool(tool: ToolDefinition, query: string): number {
  const name = normalizeSearchValue(tool.name);
  const summary = normalizeSearchValue(tool.summary);
  const description = normalizeSearchValue(tool.description);
  const category = getCategory(tool.category);
  const categoryName = normalizeSearchValue(category?.name ?? "");
  const keywords = tool.keywords.map(normalizeSearchValue);

  const tokens = query.split(" ").filter(Boolean);
  if (tokens.length === 0) {
    return 1;
  }

  let score = 0;
  for (const token of tokens) {
    let tokenScore = 0;
    if (name === token) tokenScore += 12;
    if (name.startsWith(token)) tokenScore += 8;
    if (name.includes(token)) tokenScore += 6;
    if (keywords.some((keyword) => keyword === token)) tokenScore += 7;
    if (keywords.some((keyword) => keyword.includes(token))) tokenScore += 4;
    if (summary.includes(token)) tokenScore += 3;
    if (categoryName.includes(token)) tokenScore += 2;
    if (description.includes(token)) tokenScore += 1;

    if (tokenScore === 0) {
      return 0;
    }
    score += tokenScore;
  }

  return score;
}

export function searchTools(query: string, pool: ToolDefinition[] = []): ToolDefinition[] {
  const normalized = normalizeSearchValue(query);
  const source = pool.length > 0 ? pool : undefined;
  if (!normalized) {
    return [...(source ?? [])];
  }

  return (source ?? [])
    .map((tool) => ({ tool, score: scoreTool(tool, normalized) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.order - b.tool.order)
    .map((entry) => entry.tool);
}
