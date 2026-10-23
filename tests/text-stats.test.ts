import { describe, expect, it } from "vitest";
import {
  countCharacters,
  countCharactersNoSpaces,
  countParagraphs,
  countSentences,
  countWords,
  estimateReadingMinutes,
  getTextStats,
  WORDS_PER_MINUTE,
} from "@/lib/text-stats";

describe("countWords", () => {
  it("returns 0 for empty or whitespace-only text", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   \n\t")).toBe(0);
  });

  it("counts simple English words", () => {
    expect(countWords("hello world")).toBe(2);
    expect(countWords("one two three four")).toBe(4);
  });

  it("handles punctuation without treating it as words", () => {
    expect(countWords("Hello, world!")).toBe(2);
  });
});

describe("countSentences", () => {
  it("returns 0 for empty text", () => {
    expect(countSentences("")).toBe(0);
  });

  it("counts sentences separated by terminal punctuation", () => {
    expect(countSentences("One. Two! Three?")).toBe(3);
  });
});

describe("countParagraphs", () => {
  it("returns 0 for empty text", () => {
    expect(countParagraphs("")).toBe(0);
  });

  it("counts non-empty blocks separated by newlines", () => {
    expect(countParagraphs("a\n\nb\nc")).toBe(3);
  });
});

describe("character counts", () => {
  it("counts characters including spaces", () => {
    expect(countCharacters("a b")).toBe(3);
  });

  it("counts characters excluding whitespace", () => {
    expect(countCharactersNoSpaces("a b\nc")).toBe(3);
  });
});

describe("estimateReadingMinutes", () => {
  it("returns 0 for zero words", () => {
    expect(estimateReadingMinutes(0)).toBe(0);
  });

  it("rounds up using WORDS_PER_MINUTE", () => {
    expect(estimateReadingMinutes(1)).toBe(1);
    expect(estimateReadingMinutes(WORDS_PER_MINUTE)).toBe(1);
    expect(estimateReadingMinutes(WORDS_PER_MINUTE + 1)).toBe(2);
  });
});

describe("getTextStats", () => {
  it("aggregates stats for a short paragraph", () => {
    const stats = getTextStats("Hello world. This is a test.");
    expect(stats.words).toBeGreaterThan(0);
    expect(stats.characters).toBeGreaterThan(0);
    expect(stats.sentences).toBeGreaterThanOrEqual(1);
    expect(stats.paragraphs).toBe(1);
    expect(stats.readingMinutes).toBeGreaterThanOrEqual(1);
  });
});
