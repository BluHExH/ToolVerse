export const QR_CONTRAST_MIN = 3;
export const QR_CONTRAST_RECOMMENDED = 4.5;
export const QR_MAX_BYTES = 2_000;

export type ContrastLevel = "good" | "warning" | "poor";

export interface ContrastEvaluation {
  ratio: number;
  level: ContrastLevel;
}

export function isValidHexColor(value: string): boolean {
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim();
  if (!isValidHexColor(trimmed)) {
    return null;
  }
  if (trimmed.length === 4) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return trimmed.toUpperCase();
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeHexColor(hex);
  if (!normalized) {
    return null;
  }
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

function channelToLinear(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return null;
  }
  return 0.2126 * channelToLinear(rgb.r) + 0.7152 * channelToLinear(rgb.g) + 0.0722 * channelToLinear(rgb.b);
}

export function contrastRatio(foreground: string, background: string): number | null {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  if (foregroundLuminance === null || backgroundLuminance === null) {
    return null;
  }
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

export function evaluateQrContrast(foreground: string, background: string): ContrastEvaluation | null {
  const ratio = contrastRatio(foreground, background);
  if (ratio === null) {
    return null;
  }
  const level: ContrastLevel =
    ratio >= QR_CONTRAST_RECOMMENDED ? "good" : ratio >= QR_CONTRAST_MIN ? "warning" : "poor";
  return { ratio: Math.round(ratio * 100) / 100, level };
}

export function validateQrPayload(text: string): string | null {
  if (!text.trim()) {
    return "Enter a URL or some text to turn into a QR code.";
  }
  const bytes = new TextEncoder().encode(text).length;
  if (bytes > QR_MAX_BYTES) {
    return `This payload is about ${bytes.toLocaleString("en-US")} bytes. Keep it under ${QR_MAX_BYTES.toLocaleString("en-US")} bytes for a reliable code.`;
  }
  return null;
}

export function suggestQrFileName(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug ? `toolverse-qr-${slug}` : "toolverse-qr-code";
}
