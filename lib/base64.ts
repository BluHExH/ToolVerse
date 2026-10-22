export const BASE64_MAX_CHARACTERS = 5_000_000;

export type Base64Result = { ok: true; value: string } | { ok: false; error: string };

const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;

function bytesToBinaryString(bytes: Uint8Array): string {
  const chunkSize = 0x8000;
  let binary = "";
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return binary;
}

export function encodeBase64Utf8(text: string): Base64Result {
  if (text.length === 0) {
    return { ok: false, error: "Type or paste some text to encode." };
  }
  if (text.length > BASE64_MAX_CHARACTERS) {
    return { ok: false, error: "This text is too large for the browser encoder. Try a smaller input." };
  }
  try {
    const bytes = new TextEncoder().encode(text);
    return { ok: true, value: btoa(bytesToBinaryString(bytes)) };
  } catch {
    return { ok: false, error: "The text could not be encoded. Check that the input is plain text." };
  }
}

function normalizeBase64(input: string): { value: string } | { error: string } {
  const compact = input.replace(/\s+/g, "");
  if (!compact) {
    return { error: "Paste some Base64 to decode." };
  }
  if (compact.length > BASE64_MAX_CHARACTERS) {
    return { error: "This input is too large for the browser decoder. Try a smaller value." };
  }
  if (!BASE64_PATTERN.test(compact)) {
    return {
      error: "This does not look like standard Base64. Check for invalid characters or spaces inside the data.",
    };
  }

  const withoutPadding = compact.replace(/=+$/, "");
  const remainder = withoutPadding.length % 4;
  if (remainder === 1) {
    return { error: "This Base64 is incomplete. Check for missing characters or padding." };
  }

  const padded = withoutPadding.padEnd(withoutPadding.length + ((4 - remainder) % 4), "=");
  return { value: padded };
}

export function decodeBase64Utf8(input: string): Base64Result {
  const normalized = normalizeBase64(input);
  if ("error" in normalized) {
    return { ok: false, error: normalized.error };
  }

  let binary: string;
  try {
    binary = atob(normalized.value);
  } catch {
    return { ok: false, error: "This Base64 could not be decoded. Check the value and try again." };
  }

  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  try {
    const value = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { ok: true, value };
  } catch {
    return {
      ok: false,
      error: "The Base64 is valid, but it does not contain valid UTF-8 text, so it cannot be shown here.",
    };
  }
}
