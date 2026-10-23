import { describe, expect, it } from "vitest";
import {
  minifyJsonText,
  parseJsonText,
  summarizeJsonValue,
} from "@/lib/json";

describe("parseJsonText", () => {
  it("parses and pretty-prints valid JSON with default indent", () => {
    const result = parseJsonText('{"b":1,"a":2}');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ b: 1, a: 2 });
      expect(result.formatted).toContain("\n");
      expect(result.formatted).toContain('"b"');
    }
  });

  it("supports tab indent", () => {
    const result = parseJsonText('{"x":true}', "tab");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.formatted).toContain("\t");
    }
  });

  it("rejects empty input", () => {
    const result = parseJsonText("   ");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toMatch(/no JSON/i);
    }
  });

  it("reports a parse error for malformed JSON", () => {
    const result = parseJsonText("{");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message.length).toBeGreaterThan(0);
    }
  });

  it("parses arrays and primitives", () => {
    expect(parseJsonText("[1,2,3]").ok).toBe(true);
    expect(parseJsonText("null").ok).toBe(true);
    expect(parseJsonText('"hello"').ok).toBe(true);
  });
});

describe("minifyJsonText", () => {
  it("minifies valid JSON", () => {
    const result = minifyJsonText('{\n  "a": 1\n}');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.formatted).toBe('{"a":1}');
    }
  });

  it("rejects empty input", () => {
    const result = minifyJsonText("");
    expect(result.ok).toBe(false);
  });

  it("rejects invalid JSON", () => {
    const result = minifyJsonText("{bad");
    expect(result.ok).toBe(false);
  });
});

describe("summarizeJsonValue", () => {
  it("summarizes an object", () => {
    const summary = summarizeJsonValue({ a: 1, b: { c: 2 } });
    expect(summary.type).toBe("object");
    expect(summary.keys).toBe(2);
    expect(summary.items).toBeNull();
    expect(summary.depth).toBeGreaterThanOrEqual(2);
  });

  it("summarizes an array", () => {
    const summary = summarizeJsonValue([1, 2, [3]]);
    expect(summary.type).toBe("array");
    expect(summary.items).toBe(3);
    expect(summary.keys).toBeNull();
  });

  it("handles null and primitives", () => {
    expect(summarizeJsonValue(null).type).toBe("null");
    expect(summarizeJsonValue(42).type).toBe("number");
    expect(summarizeJsonValue("x").type).toBe("string");
  });
});
