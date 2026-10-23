import { describe, expect, it } from "vitest";
import { decodeBase64Utf8, encodeBase64Utf8, BASE64_MAX_CHARACTERS } from "@/lib/base64";

describe("encodeBase64Utf8", () => {
  it("encodes plain ASCII text", () => {
    const result = encodeBase64Utf8("hello");
    expect(result).toEqual({ ok: true, value: "aGVsbG8=" });
  });

  it("encodes UTF-8 characters", () => {
    const result = encodeBase64Utf8("café");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(decodeBase64Utf8(result.value)).toEqual({ ok: true, value: "café" });
    }
  });

  it("rejects empty input", () => {
    const result = encodeBase64Utf8("");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/text/i);
    }
  });

  it("rejects oversized input", () => {
    const huge = "x".repeat(BASE64_MAX_CHARACTERS + 1);
    const result = encodeBase64Utf8(huge);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/too large/i);
    }
  });
});

describe("decodeBase64Utf8", () => {
  it("decodes valid Base64", () => {
    expect(decodeBase64Utf8("aGVsbG8=")).toEqual({ ok: true, value: "hello" });
  });

  it("ignores whitespace in the input", () => {
    expect(decodeBase64Utf8("aGVs\nbG8=")).toEqual({ ok: true, value: "hello" });
  });

  it("rejects empty input", () => {
    const result = decodeBase64Utf8("   ");
    expect(result.ok).toBe(false);
  });

  it("rejects invalid characters", () => {
    const result = decodeBase64Utf8("!!!not-base64!!!");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/Base64|invalid/i);
    }
  });

  it("rejects incomplete padding patterns", () => {
    const result = decodeBase64Utf8("Y");
    expect(result.ok).toBe(false);
  });

  it("rejects binary that is not valid UTF-8", () => {
    // Valid Base64 that decodes to invalid UTF-8 sequences
    const result = decodeBase64Utf8("//8=");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/UTF-8/i);
    }
  });
});
