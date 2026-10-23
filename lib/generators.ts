const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";

function randomInt(max: number): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! % max;
  }
  return Math.floor(Math.random() * max);
}

export function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC4122-ish fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = randomInt(16);
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generatePassword(options: {
  length: number;
  lower?: boolean;
  upper?: boolean;
  digits?: boolean;
  symbols?: boolean;
}): string {
  const length = Math.min(128, Math.max(4, Math.floor(options.length || 16)));
  let alphabet = "";
  if (options.lower !== false) alphabet += LOWER;
  if (options.upper !== false) alphabet += UPPER;
  if (options.digits !== false) alphabet += DIGITS;
  if (options.symbols) alphabet += SYMBOLS;
  if (!alphabet) alphabet = LOWER + UPPER + DIGITS;

  const chars: string[] = [];
  for (let i = 0; i < length; i++) {
    chars.push(alphabet[randomInt(alphabet.length)]!);
  }
  return chars.join("");
}
