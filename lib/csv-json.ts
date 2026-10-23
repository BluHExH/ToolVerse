export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch === "\r") {
      // ignore; handle on \n
    } else {
      cell += ch;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim().length > 0));
}

export function csvToJson(text: string, pretty = true): { ok: true; value: string } | { ok: false; error: string } {
  const rows = parseCsv(text);
  if (rows.length === 0) return { ok: false, error: "CSV is empty." };
  const headers = rows[0]!.map((h, i) => h.trim() || `column_${i + 1}`);
  const data = rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] ?? "";
    });
    return obj;
  });
  return { ok: true, value: pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data) };
}

export function jsonToCsv(text: string): { ok: true; value: string } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "Invalid JSON." };
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { ok: false, error: "JSON must be a non-empty array of objects." };
  }

  const objects = parsed.filter((item) => item && typeof item === "object" && !Array.isArray(item)) as Record<
    string,
    unknown
  >[];
  if (objects.length === 0) {
    return { ok: false, error: "JSON must be an array of objects." };
  }

  const headers: string[] = [];
  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      if (!headers.includes(key)) headers.push(key);
    }
  }

  const escape = (value: unknown): string => {
    const str = value == null ? "" : String(value);
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const lines = [headers.map(escape).join(",")];
  for (const obj of objects) {
    lines.push(headers.map((h) => escape(obj[h])).join(","));
  }
  return { ok: true, value: lines.join("\n") };
}
