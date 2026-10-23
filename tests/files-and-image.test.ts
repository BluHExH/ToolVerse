import { describe, expect, it } from "vitest";
import {
  fileBaseName,
  getExtension,
  FILE_LIMITS,
} from "@/lib/files";
import {
  extensionForMime,
  fitToAspectRatio,
  mimeForFormat,
  replaceExtension,
  resolveOutputMime,
  sizeReductionPercent,
  validateDimensions,
  withSuffix,
} from "@/lib/image";

describe("file helpers", () => {
  it("extracts extension and base name", () => {
    expect(getExtension("Report.PDF")).toBe("pdf");
    expect(getExtension("noext")).toBe("");
    expect(fileBaseName("photo.jpeg")).toBe("photo");
    expect(fileBaseName("archive")).toBe("archive");
  });

  it("exposes documented size limits", () => {
    expect(FILE_LIMITS.maxPdfBytes).toBe(50 * 1024 * 1024);
    expect(FILE_LIMITS.maxImageBytes).toBe(25 * 1024 * 1024);
    expect(FILE_LIMITS.maxPdfFiles).toBe(20);
  });
});

describe("image helpers", () => {
  it("maps formats to MIME types and extensions", () => {
    expect(mimeForFormat("jpeg")).toBe("image/jpeg");
    expect(mimeForFormat("png")).toBe("image/png");
    expect(mimeForFormat("webp")).toBe("image/webp");
    expect(extensionForMime("image/jpeg")).toBe("jpg");
    expect(extensionForMime("image/png")).toBe("png");
  });

  it("resolves output MIME for original and explicit formats", () => {
    expect(resolveOutputMime("original", "image/jpeg")).toBe("image/jpeg");
    expect(resolveOutputMime("original", "application/octet-stream")).toBe("image/png");
    expect(resolveOutputMime("webp", "image/png")).toBe("image/webp");
  });

  it("replaces extensions and adds suffixes", () => {
    expect(replaceExtension("photo.jpeg", "png")).toBe("photo.png");
    expect(withSuffix("photo.jpeg", "resized")).toBe("photo-resized.jpeg");
    expect(withSuffix("photo.jpeg", "resized", "png")).toBe("photo-resized.png");
  });

  it("validates dimensions", () => {
    expect(validateDimensions(800, 600)).toBeNull();
    expect(validateDimensions(0, 100)).toMatch(/at least 1/i);
    expect(validateDimensions(1.5, 100)).toMatch(/whole numbers/i);
    expect(validateDimensions(FILE_LIMITS.maxDimension + 1, 10)).toMatch(/maximum/i);
    expect(validateDimensions(10000, 10000)).toMatch(/40 megapixels/i);
  });

  it("fits aspect ratio on either axis", () => {
    // 16:9 source, lock height from width 1600 → height 900
    expect(fitToAspectRatio(1600, 16, 9, "width")).toBe(900);
    expect(fitToAspectRatio(900, 16, 9, "height")).toBe(1600);
  });

  it("computes size reduction percent", () => {
    expect(sizeReductionPercent(1000, 250)).toBe(75);
    expect(sizeReductionPercent(1000, 1000)).toBe(0);
    expect(sizeReductionPercent(0, 0)).toBe(0);
  });
});
