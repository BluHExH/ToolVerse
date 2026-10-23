import { describe, expect, it } from "vitest";
import {
  contrastRatio,
  evaluateQrContrast,
  isValidHexColor,
  normalizeHexColor,
  suggestQrFileName,
  validateQrPayload,
  QR_MAX_BYTES,
} from "@/lib/qr";

describe("hex color helpers", () => {
  it("validates hex colors", () => {
    expect(isValidHexColor("#fff")).toBe(true);
    expect(isValidHexColor("#FFFFFF")).toBe(true);
    expect(isValidHexColor("#00ffaa")).toBe(true);
    expect(isValidHexColor("fff")).toBe(false);
    expect(isValidHexColor("#gg0000")).toBe(false);
  });

  it("normalizes short and long hex", () => {
    expect(normalizeHexColor("#abc")).toBe("#AABBCC");
    expect(normalizeHexColor("#aabbcc")).toBe("#AABBCC");
    expect(normalizeHexColor("nope")).toBeNull();
  });
});

describe("contrast", () => {
  it("computes high contrast for black on white", () => {
    const ratio = contrastRatio("#000000", "#FFFFFF");
    expect(ratio).not.toBeNull();
    expect(ratio!).toBeGreaterThan(20);
  });

  it("evaluates good / warning / poor levels", () => {
    const good = evaluateQrContrast("#000000", "#FFFFFF");
    expect(good?.level).toBe("good");

    const same = evaluateQrContrast("#808080", "#808080");
    expect(same?.level).toBe("poor");
  });
});

describe("validateQrPayload", () => {
  it("accepts a normal URL", () => {
    expect(validateQrPayload("https://example.com")).toBeNull();
  });

  it("rejects empty payload", () => {
    expect(validateQrPayload("   ")).toMatch(/URL or some text/i);
  });

  it("rejects oversized payload", () => {
    const huge = "x".repeat(QR_MAX_BYTES + 100);
    const error = validateQrPayload(huge);
    expect(error).toMatch(/bytes/i);
  });
});

describe("suggestQrFileName", () => {
  it("slugs a URL into a safe name", () => {
    const name = suggestQrFileName("https://Example.com/path");
    expect(name).toMatch(/^toolverse-qr-/);
    expect(name).not.toContain("://");
  });

  it("falls back for empty text", () => {
    expect(suggestQrFileName("")).toBe("toolverse-qr-code");
  });
});
