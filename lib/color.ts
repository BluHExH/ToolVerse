export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function parseHex(input: string): Rgb | null {
  const raw = input.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(raw)) return null;
  const hex =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 1000) / 10 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  h /= 6;
  return {
    h: Math.round(h * 3600) / 10,
    s: Math.round(s * 1000) / 10,
    l: Math.round(l * 1000) / 10,
  };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hh = ((h % 360) + 360) % 360;
  const ss = clamp(s, 0, 100) / 100;
  const ll = clamp(l, 0, 100) / 100;
  if (ss === 0) {
    const v = Math.round(ll * 255);
    return { r: v, g: v, b: v };
  }
  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  const hue2rgb = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const hk = hh / 360;
  return {
    r: Math.round(hue2rgb(hk + 1 / 3) * 255),
    g: Math.round(hue2rgb(hk) * 255),
    b: Math.round(hue2rgb(hk - 1 / 3) * 255),
  };
}

export function formatRgb(rgb: Rgb): string {
  return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
}

export function formatHsl(hsl: Hsl): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function parseRgbString(input: string): Rgb | null {
  const m = input.trim().match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (!m) return null;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  if ([r, g, b].some((n) => n > 255)) return null;
  return { r, g, b };
}
