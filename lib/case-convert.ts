export type CaseStyle =
  | "lower"
  | "upper"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant";

function splitWords(input: string): string[] {
  const normalized = input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
  if (!normalized) return [];
  return normalized.split(/\s+/).filter(Boolean);
}

export function convertCase(input: string, style: CaseStyle): string {
  const words = splitWords(input);
  if (words.length === 0) return "";

  switch (style) {
    case "lower":
      return input.toLocaleLowerCase();
    case "upper":
      return input.toLocaleUpperCase();
    case "title":
      return words.map((w) => w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase()).join(" ");
    case "sentence": {
      const lower = input.toLocaleLowerCase();
      return lower.replace(/(^\s*\p{L})|([.!?]\s+\p{L})/gu, (m) => m.toLocaleUpperCase());
    }
    case "camel":
      return words
        .map((w, i) => {
          const lower = w.toLocaleLowerCase();
          return i === 0 ? lower : lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
        })
        .join("");
    case "pascal":
      return words.map((w) => {
        const lower = w.toLocaleLowerCase();
        return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
      }).join("");
    case "snake":
      return words.map((w) => w.toLocaleLowerCase()).join("_");
    case "kebab":
      return words.map((w) => w.toLocaleLowerCase()).join("-");
    case "constant":
      return words.map((w) => w.toLocaleUpperCase()).join("_");
    default:
      return input;
  }
}

export const CASE_STYLES: { id: CaseStyle; label: string }[] = [
  { id: "lower", label: "lower case" },
  { id: "upper", label: "UPPER CASE" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
  { id: "constant", label: "CONSTANT_CASE" },
];
