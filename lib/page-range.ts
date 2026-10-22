export type PageSelectionResult =
  | { ok: true; pages: number[]; label: string }
  | { ok: false; error: string };

const TOKEN_PATTERN = /^(\d+)(?:\s*-\s*(\d+))?$/;

export function parsePageSelection(input: string, totalPages: number): PageSelectionResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter at least one page or range." };
  }
  if (!Number.isInteger(totalPages) || totalPages < 1) {
    return { ok: false, error: "The document does not have any pages to select." };
  }

  const tokens = trimmed.split(",");
  const pages = new Set<number>();

  for (const rawToken of tokens) {
    const token = rawToken.trim().replace(/\s+/g, " ");
    if (!token) {
      return { ok: false, error: "There is an empty entry in the list. Remove the extra comma." };
    }

    const match = token.match(TOKEN_PATTERN);
    if (!match) {
      return {
        ok: false,
        error: `"${token}" is not a valid page or range. Use formats such as 3 or 4-7.`,
      };
    }

    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;

    if (start < 1 || end < 1) {
      return { ok: false, error: "Page numbers start at 1." };
    }
    if (start > totalPages || end > totalPages) {
      return {
        ok: false,
        error: `This document has ${totalPages} page${totalPages === 1 ? "" : "s"}. Page numbers cannot be higher than that.`,
      };
    }
    if (start > end) {
      return { ok: false, error: `The range "${token}" is reversed. Write it as ${end}-${start}.` };
    }

    for (let page = start; page <= end; page += 1) {
      pages.add(page);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);
  return { ok: true, pages: sorted, label: formatPageSelection(sorted) };
}

export function formatPageSelection(pages: number[]): string {
  if (pages.length === 0) {
    return "No pages";
  }
  const sorted = [...new Set(pages)].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let previous = sorted[0];

  for (let index = 1; index <= sorted.length; index += 1) {
    const current = sorted[index];
    if (current !== undefined && current === previous + 1) {
      previous = current;
      continue;
    }
    ranges.push(start === previous ? `${start}` : `${start}-${previous}`);
    start = current;
    previous = current;
  }

  return ranges.join(", ");
}

export function selectOddPages(totalPages: number): number[] {
  const pages: number[] = [];
  for (let page = 1; page <= totalPages; page += 2) {
    pages.push(page);
  }
  return pages;
}

export function selectEvenPages(totalPages: number): number[] {
  const pages: number[] = [];
  for (let page = 2; page <= totalPages; page += 2) {
    pages.push(page);
  }
  return pages;
}
