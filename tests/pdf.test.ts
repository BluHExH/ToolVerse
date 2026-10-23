import { describe, expect, it } from "vitest";
import { describePdfLoadError } from "@/lib/pdf";

describe("describePdfLoadError", () => {
  it("maps password errors", () => {
    expect(describePdfLoadError(new Error("Encrypted PDF: password required"))).toMatch(
      /password-protected/i,
    );
  });

  it("maps parse / header errors", () => {
    expect(describePdfLoadError(new Error("Failed to parse PDF document"))).toMatch(
      /not a valid PDF|damaged/i,
    );
    expect(describePdfLoadError(new Error("No PDF header found"))).toMatch(
      /not a valid PDF|damaged/i,
    );
  });

  it("returns a generic message for unknown errors", () => {
    expect(describePdfLoadError(new Error("something else"))).toMatch(/could not be read/i);
  });
});
