export interface JsonParseError {
  message: string;
  line: number | null;
  column: number | null;
  position: number | null;
  lineText: string | null;
}

export type JsonParseResult =
  | { ok: true; value: unknown; formatted: string }
  | { ok: false; error: JsonParseError };

export type JsonValueSummary = {
  type: string;
  keys: number | null;
  items: number | null;
  depth: number;
};

function positionToLineColumn(input: string, position: number) {
  let line = 1;
  let column = 1;
  const limit = Math.min(position, input.length);
  for (let index = 0; index < limit; index += 1) {
    if (input[index] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

function cleanMessage(raw: string): string {
  return raw
    .replace(/^JSON\.parse:\s*/i, "")
    .replace(/\s+in JSON at position \d+.*$/i, "")
    .replace(/\s+at position \d+.*$/i, "")
    .replace(/\s*\(line \d+ column \d+\)\s*$/i, "")
    .trim();
}

function extractPosition(raw: string, input: string): number | null {
  const direct = raw.match(/position\s+(\d+)/i);
  if (direct) {
    return Number(direct[1]);
  }
  const lineColumn = raw.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColumn) {
    const targetLine = Number(lineColumn[1]);
    const targetColumn = Number(lineColumn[2]);
    const lines = input.split("\n");
    let position = 0;
    for (let line = 0; line < lines.length; line += 1) {
      if (line + 1 === targetLine) {
        return position + Math.max(0, targetColumn - 1);
      }
      position += lines[line].length + 1;
    }
  }
  const lineOnly = raw.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineOnly) {
    return null;
  }
  return null;
}

export function describeJsonError(input: string, error: unknown): JsonParseError {
  const raw = error instanceof Error ? error.message : String(error);
  const message = cleanMessage(raw) || "This does not look like valid JSON.";
  const position = extractPosition(raw, input);

  if (position === null) {
    return { message, line: null, column: null, position: null, lineText: null };
  }

  const { line, column } = positionToLineColumn(input, position);
  const lineText = input.split("\n")[line - 1] ?? null;
  return { message, line, column, position, lineText };
}

export function parseJsonText(input: string, indent: number | string = 2): JsonParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      ok: false,
      error: {
        message: "There is no JSON to check yet. Paste or type some JSON first.",
        line: null,
        column: null,
        position: null,
        lineText: null,
      },
    };
  }

  try {
    const value: unknown = JSON.parse(input);
    const space = indent === "tab" ? "\t" : Number(indent);
    return { ok: true, value, formatted: JSON.stringify(value, null, space) };
  } catch (error) {
    return { ok: false, error: describeJsonError(input, error) };
  }
}

export function minifyJsonText(input: string): JsonParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      ok: false,
      error: {
        message: "There is no JSON to minify yet. Paste or type some JSON first.",
        line: null,
        column: null,
        position: null,
        lineText: null,
      },
    };
  }

  try {
    const value: unknown = JSON.parse(input);
    return { ok: true, value, formatted: JSON.stringify(value) };
  } catch (error) {
    return { ok: false, error: describeJsonError(input, error) };
  }
}

export function summarizeJsonValue(value: unknown, depthLimit = 12): JsonValueSummary {
  const type = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
  let keys: number | null = null;
  let items: number | null = null;
  let depth = 0;

  if (Array.isArray(value)) {
    items = value.length;
  } else if (value !== null && typeof value === "object") {
    keys = Object.keys(value as Record<string, unknown>).length;
  }

  let reachedLimit = false;
  const walk = (node: unknown, currentDepth: number) => {
    if (currentDepth > depthLimit) {
      reachedLimit = true;
      return;
    }
    depth = Math.max(depth, currentDepth);
    if (Array.isArray(node)) {
      for (const item of node) {
        walk(item, currentDepth + 1);
      }
    } else if (node !== null && typeof node === "object") {
      for (const child of Object.values(node as Record<string, unknown>)) {
        walk(child, currentDepth + 1);
      }
    }
  };

  walk(value, 1);
  return { type, keys, items, depth: reachedLimit ? depthLimit : depth };
}
