import { describe, expect, it } from "vitest";
import {
  formatPageSelection,
  parsePageSelection,
  selectEvenPages,
  selectOddPages,
} from "@/lib/page-range";

describe("parsePageSelection", () => {
  it("parses single pages and ranges", () => {
    const result = parsePageSelection("1, 3-5, 8", 10);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.pages).toEqual([1, 3, 4, 5, 8]);
      expect(result.label).toBe("1, 3-5, 8");
    }
  });

  it("deduplicates and sorts pages", () => {
    const result = parsePageSelection("5, 1, 3-4, 4", 10);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.pages).toEqual([1, 3, 4, 5]);
    }
  });

  it("rejects empty input", () => {
    const result = parsePageSelection("  ", 5);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/page or range/i);
    }
  });

  it("rejects empty tokens from extra commas", () => {
    const result = parsePageSelection("1,,3", 5);
    expect(result.ok).toBe(false);
  });

  it("rejects pages outside the document", () => {
    const result = parsePageSelection("1-12", 10);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/10/);
    }
  });

  it("rejects reversed ranges", () => {
    const result = parsePageSelection("5-2", 10);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/2-5/);
    }
  });

  it("rejects invalid tokens", () => {
    const result = parsePageSelection("abc", 10);
    expect(result.ok).toBe(false);
  });

  it("rejects zero or negative total pages", () => {
    expect(parsePageSelection("1", 0).ok).toBe(false);
  });
});

describe("formatPageSelection", () => {
  it("formats consecutive pages as ranges", () => {
    expect(formatPageSelection([1, 2, 3, 5, 7, 8])).toBe("1-3, 5, 7-8");
  });

  it("handles empty selection", () => {
    expect(formatPageSelection([])).toBe("No pages");
  });
});

describe("odd and even helpers", () => {
  it("selects odd pages", () => {
    expect(selectOddPages(5)).toEqual([1, 3, 5]);
  });

  it("selects even pages", () => {
    expect(selectEvenPages(5)).toEqual([2, 4]);
  });

  it("returns empty for zero pages", () => {
    expect(selectOddPages(0)).toEqual([]);
    expect(selectEvenPages(0)).toEqual([]);
  });
});
