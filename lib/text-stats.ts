export const WORDS_PER_MINUTE = 200;

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingMinutes: number;
}

function countWordsWithSegmenter(text: string): number | null {
  if (typeof Intl === "undefined" || typeof Intl.Segmenter !== "function") {
    return null;
  }
  const segmenter = new Intl.Segmenter(undefined, { granularity: "word" });
  let count = 0;
  for (const segment of segmenter.segment(text)) {
    if (segment.isWordLike) {
      count += 1;
    }
  }
  return count;
}

function countSentencesWithSegmenter(text: string): number | null {
  if (typeof Intl === "undefined" || typeof Intl.Segmenter !== "function") {
    return null;
  }
  const segmenter = new Intl.Segmenter(undefined, { granularity: "sentence" });
  let count = 0;
  for (const segment of segmenter.segment(text)) {
    if (segment.segment.trim().length > 0) {
      count += 1;
    }
  }
  return count;
}

const WORD_FALLBACK = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }
  const segmented = countWordsWithSegmenter(trimmed);
  if (segmented !== null) {
    return segmented;
  }
  return trimmed.match(WORD_FALLBACK)?.length ?? 0;
}

export function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }
  const segmented = countSentencesWithSegmenter(trimmed);
  if (segmented !== null) {
    return segmented;
  }
  const matches = trimmed.match(/[^.!?…]+(?:[.!?…]+|$)/g) ?? [];
  return matches.filter((match) => match.trim().length > 0).length;
}

export function countParagraphs(text: string): number {
  if (!text.trim()) {
    return 0;
  }
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean).length;
}

export function countCharacters(text: string): number {
  return Array.from(text).length;
}

export function countCharactersNoSpaces(text: string): number {
  return Array.from(text.replace(/\s/gu, "")).length;
}

export function estimateReadingMinutes(words: number): number {
  if (words <= 0) {
    return 0;
  }
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function getTextStats(text: string): TextStats {
  const words = countWords(text);
  return {
    words,
    characters: countCharacters(text),
    charactersNoSpaces: countCharactersNoSpaces(text),
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    readingMinutes: estimateReadingMinutes(words),
  };
}
