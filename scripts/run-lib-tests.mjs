/**
 * Lightweight unit-test runner for pure lib/ modules.
 * Uses Node's experimental TypeScript strip so it can run without a full
 * node_modules install when the environment cannot complete `npm install`.
 *
 * Prefer `npx vitest run` when dependencies are installed.
 */
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
let passed = 0;

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
    console.error("  FAIL:", message);
  } else {
    passed += 1;
    console.log("  ok:", message);
  }
}

async function load(rel) {
  const url = pathToFileURL(path.join(root, rel)).href;
  return import(url);
}

console.log("\n=== JSON ===");
{
  const { parseJsonText, minifyJsonText, summarizeJsonValue } = await load("lib/json.ts");
  const ok = parseJsonText('{"a":1}');
  assert(ok.ok === true && ok.value.a === 1, "parse valid object");
  assert(parseJsonText("").ok === false, "reject empty JSON");
  assert(parseJsonText("{").ok === false, "reject malformed JSON");
  const mini = minifyJsonText('{\n  "a": 1\n}');
  assert(mini.ok && mini.formatted === '{"a":1}', "minify JSON");
  const summary = summarizeJsonValue([1, { x: 2 }]);
  assert(summary.type === "array" && summary.items === 2, "summarize array");
}

console.log("\n=== Base64 ===");
{
  const { encodeBase64Utf8, decodeBase64Utf8 } = await load("lib/base64.ts");
  const enc = encodeBase64Utf8("hello");
  assert(enc.ok && enc.value === "aGVsbG8=", "encode hello");
  assert(decodeBase64Utf8("aGVsbG8=").ok && decodeBase64Utf8("aGVsbG8=").value === "hello", "decode hello");
  assert(encodeBase64Utf8("").ok === false, "reject empty encode");
  assert(decodeBase64Utf8("!!!").ok === false, "reject invalid decode");
}

console.log("\n=== Text stats ===");
{
  const { countWords, countParagraphs, estimateReadingMinutes, getTextStats } = await load(
    "lib/text-stats.ts",
  );
  assert(countWords("") === 0, "empty words");
  assert(countWords("hello world") === 2, "two words");
  assert(countParagraphs("a\n\nb") === 2, "two paragraphs");
  assert(estimateReadingMinutes(0) === 0, "zero reading minutes");
  assert(estimateReadingMinutes(1) === 1, "minimum one minute");
  const stats = getTextStats("One. Two.");
  assert(stats.words >= 2 && stats.sentences >= 1, "aggregate stats");
}

console.log("\n=== Page range ===");
{
  const { parsePageSelection, formatPageSelection, selectOddPages } = await load("lib/page-range.ts");
  const sel = parsePageSelection("1, 3-5", 10);
  assert(sel.ok && sel.pages.join(",") === "1,3,4,5", "parse ranges");
  assert(parsePageSelection("", 5).ok === false, "reject empty selection");
  assert(parsePageSelection("1-99", 5).ok === false, "reject out of range");
  assert(formatPageSelection([1, 2, 3, 5]) === "1-3, 5", "format ranges");
  assert(selectOddPages(4).join(",") === "1,3", "odd pages");
}

console.log("\n=== QR ===");
{
  const { isValidHexColor, contrastRatio, validateQrPayload, suggestQrFileName } = await load(
    "lib/qr.ts",
  );
  assert(isValidHexColor("#fff") === true, "valid short hex");
  assert(isValidHexColor("bad") === false, "invalid hex");
  const ratio = contrastRatio("#000000", "#FFFFFF");
  assert(ratio !== null && ratio > 20, "black/white contrast");
  assert(validateQrPayload("") !== null, "empty payload error");
  assert(validateQrPayload("https://example.com") === null, "valid payload");
  assert(suggestQrFileName("https://Example.com").startsWith("toolverse-qr-"), "file name slug");
}

console.log("\n=== Files helpers ===");
{
  const { getExtension, fileBaseName, FILE_LIMITS } = await load("lib/files.ts");
  assert(getExtension("a.PDF") === "pdf", "extension lowercased");
  assert(fileBaseName("a.jpeg") === "a", "base name");
  assert(FILE_LIMITS.maxPdfBytes === 50 * 1024 * 1024, "pdf limit");
  assert(FILE_LIMITS.maxImageBytes === 25 * 1024 * 1024, "image limit");
}

// image.ts imports ./files without an extension; Node ESM strip-types needs a full
// resolver (as provided by Vitest). Those cases are covered by tests/files-and-image.test.ts.

console.log("\n=== PDF error messages ===");
{
  const { describePdfLoadError } = await load("lib/pdf.ts");
  assert(/password/i.test(describePdfLoadError(new Error("encrypted password"))), "password msg");
  assert(/valid PDF|damaged/i.test(describePdfLoadError(new Error("Failed to parse PDF"))), "parse msg");
}

console.log("\n--------------------------------");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failures.length}`);
if (failures.length) {
  process.exitCode = 1;
} else {
  console.log("All lib unit checks passed.");
}
