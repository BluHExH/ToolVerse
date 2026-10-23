import type { CategorySlug } from "./categories";

export type ToolSlug =
  | "pdf-merger"
  | "pdf-splitter"
  | "image-compressor"
  | "image-resizer"
  | "jpg-to-png"
  | "json-formatter"
  | "json-validator"
  | "base64-encoder"
  | "qr-code-generator"
  | "word-counter"
  | "case-converter"
  | "uuid-password-generator"
  | "color-converter"
  | "markdown-preview"
  | "csv-json-converter";

export type ToolIconName =
  | "merge"
  | "scissors"
  | "minimize"
  | "scaling"
  | "file-image"
  | "braces"
  | "badge-check"
  | "binary"
  | "qr-code"
  | "type-count"
  | "case"
  | "key"
  | "palette"
  | "markdown"
  | "table";

export interface ToolDefinition {
  slug: ToolSlug;
  name: string;
  summary: string;
  description: string;
  category: CategorySlug;
  icon: ToolIconName;
  href: string;
  status: "available";
  keywords: string[];
  steps: string[];
  limits: string[];
  processing: string;
  order: number;
  featured: boolean;
}

export const tools: ToolDefinition[] = [
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    summary: "Combine several PDFs into one clean document.",
    description:
      "Add PDF files, arrange them in the order you want, and download a single merged PDF. Every file is read and combined locally in your browser.",
    category: "pdf",
    icon: "merge",
    href: "/tools/pdf-merger",
    status: "available",
    keywords: ["merge pdf", "combine pdf", "join pdf", "concatenate pdf", "pdf"],
    steps: [
      "Add two or more PDF files with the file picker or by dropping them onto the page.",
      "Check the page count for each document, then reorder or remove files.",
      "Select Merge PDFs and download the combined document.",
    ],
    limits: [
      "Up to 20 files per merge and 50 MB per file.",
      "Password-protected or damaged PDFs cannot be merged.",
      "The merged document keeps each page as it appears in the source files.",
    ],
    processing:
      "Files are read with the browser's file APIs and merged with pdf-lib. Nothing is uploaded to a server.",
    order: 1,
    featured: true,
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter",
    summary: "Extract exactly the pages you need from a PDF.",
    description:
      "Choose page ranges or individual pages, preview how many pages you selected, and download a new PDF containing only those pages.",
    category: "pdf",
    icon: "scissors",
    href: "/tools/pdf-splitter",
    status: "available",
    keywords: ["split pdf", "extract pages", "pdf pages", "page range", "pdf"],
    steps: [
      "Add one PDF file and review its size and page count.",
      "Enter page ranges such as 1-3, 7, 10-12, or use a quick selection.",
      "Select Split PDF and download the extracted pages as a new document.",
    ],
    limits: [
      "One PDF up to 50 MB per split.",
      "Encrypted PDFs must be unlocked before they can be split.",
      "Selected pages are written to the output in document order.",
    ],
    processing:
      "The PDF is loaded with pdf-lib and selected pages are copied into a new document on your device.",
    order: 2,
    featured: true,
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    summary: "Shrink JPEG, PNG, and WebP images with quality control.",
    description:
      "Re-encode an image at a lower quality setting and compare the before and after file sizes. Transparency is preserved where the output format supports it.",
    category: "image",
    icon: "minimize",
    href: "/tools/image-compressor",
    status: "available",
    keywords: ["compress image", "compress jpeg", "compress png", "reduce image size", "webp"],
    steps: [
      "Add a JPEG, PNG, or WebP image and review its dimensions.",
      "Choose an output format and quality level. Quality applies to JPEG and WebP.",
      "Compress the image, compare the sizes, then download the result.",
    ],
    limits: [
      "One image up to 25 MB per compression.",
      "JPEG and WebP compression is lossy; the quality slider controls the trade-off.",
      "PNG output is encoded without quality loss and may be larger than the original.",
    ],
    processing:
      "Your image is drawn to a canvas and re-encoded by the browser. The original file is never uploaded.",
    order: 3,
    featured: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    summary: "Resize images to exact dimensions with a ratio lock.",
    description:
      "Set a target width and height, keep the original aspect ratio if you want, and export a resized copy in JPEG, PNG, or WebP.",
    category: "image",
    icon: "scaling",
    href: "/tools/image-resizer",
    status: "available",
    keywords: ["resize image", "scale image", "change image size", "dimensions", "pixels"],
    steps: [
      "Add a JPEG, PNG, or WebP image to see its current dimensions.",
      "Enter a target width and height, or keep the ratio lock and change one value.",
      "Select Resize Image, check the result, and download it.",
    ],
    limits: [
      "One image up to 25 MB and up to 40 megapixels in the result.",
      "Upscaling makes an image larger but cannot add real detail.",
      "Very large images need more memory while they are processed.",
    ],
    processing:
      "The image is resized on a canvas in your browser and exported with the format you choose.",
    order: 4,
    featured: true,
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG Converter",
    summary: "Convert JPEG photos to PNG files in one step.",
    description:
      "Turn a JPG or JPEG image into a PNG using the browser canvas. The result is a lossless PNG container, though detail already lost to JPEG compression is not restored.",
    category: "image",
    icon: "file-image",
    href: "/tools/jpg-to-png",
    status: "available",
    keywords: ["jpg to png", "jpeg to png", "convert image", "png converter"],
    steps: [
      "Add a .jpg or .jpeg image and confirm the preview looks correct.",
      "Select Convert to PNG to create the new image.",
      "Download the PNG file. The conversion happens entirely on your device.",
    ],
    limits: [
      "One JPEG image up to 25 MB per conversion.",
      "Converting to PNG does not restore quality lost during the original JPEG compression.",
      "PNG files are often larger than the JPEG they came from.",
    ],
    processing:
      "The JPEG is decoded by the browser and re-encoded as PNG on a canvas. No image data is uploaded.",
    order: 5,
    featured: false,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    summary: "Format or minify JSON with readable indentation.",
    description:
      "Paste JSON, choose an indentation style, and get consistently formatted output. Minify when you need the smallest possible representation.",
    category: "developer",
    icon: "braces",
    href: "/tools/json-formatter",
    status: "available",
    keywords: ["json formatter", "beautify json", "pretty print json", "minify json", "json"],
    steps: [
      "Paste or type JSON into the input editor.",
      "Choose an indent size, then select Format. Use Minify for compact output.",
      "Copy the result or download it as a .json file.",
    ],
    limits: [
      "The input must be valid JSON. Comments and trailing commas are not supported.",
      "Formatting preserves key order and does not change values.",
      "The editor is intended for reasonably sized documents, not multi-megabyte payloads.",
    ],
    processing: "JSON is parsed and formatted in memory in your browser. Nothing is sent anywhere.",
    order: 6,
    featured: true,
  },
  {
    slug: "json-validator",
    name: "JSON Validator",
    summary: "Check JSON syntax and locate errors by line and column.",
    description:
      "Validate pasted JSON, see whether it parses, and get a clear error message with the position of the first problem. This checks syntax only, not a schema.",
    category: "developer",
    icon: "badge-check",
    href: "/tools/json-validator",
    status: "available",
    keywords: ["json validator", "validate json", "json syntax check", "json error", "json"],
    steps: [
      "Paste the JSON you want to check.",
      "Select Validate JSON to parse it.",
      "If it is valid, review the summary. If not, use the line and column to fix it.",
    ],
    limits: [
      "This tool validates JSON syntax only. It does not validate against a JSON Schema.",
      "Multiple errors may exist; the tool reports the first one encountered by the parser.",
      "Duplicate keys are allowed by the parser, and the last value wins.",
    ],
    processing: "Validation runs with the browser's JSON parser. Your input stays on your device.",
    order: 7,
    featured: false,
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder / Decoder",
    summary: "Encode text to Base64 or decode Base64 back to text.",
    description:
      "Convert UTF-8 text to standard Base64 or decode Base64 to readable text. Unicode characters are handled correctly in both directions.",
    category: "developer",
    icon: "binary",
    href: "/tools/base64-encoder",
    status: "available",
    keywords: ["base64 encode", "base64 decode", "base64 converter", "utf-8", "encode"],
    steps: [
      "Choose whether you want to encode or decode.",
      "Paste or type your input into the editor.",
      "Run the conversion, then copy the result or clear both fields.",
    ],
    limits: [
      "Standard Base64 is supported, with or without padding. Base64url data must be converted first.",
      "Decoded bytes must form valid UTF-8 text to be displayed.",
      "Very large inputs are limited to keep the interface responsive.",
    ],
    processing: "Encoding uses TextEncoder and btoa in your browser. No text is transmitted.",
    order: 8,
    featured: false,
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    summary: "Create downloadable QR codes with custom size and colors.",
    description:
      "Turn a link or short piece of text into a real QR code, adjust the size and colors, and download it as PNG or SVG.",
    category: "developer",
    icon: "qr-code",
    href: "/tools/qr-code-generator",
    status: "available",
    keywords: ["qr code", "qr code generator", "create qr", "qr png", "barcode"],
    steps: [
      "Enter a URL, message, or other short text.",
      "Adjust the size, error-correction level, and colors. Keep strong contrast for reliable scanning.",
      "Download the code as a PNG for screens and documents, or as an SVG for print.",
    ],
    limits: [
      "Keep the payload short. Very long text produces a dense code that is harder to scan.",
      "Low contrast between foreground and background can prevent scanners from reading the code.",
      "Always test the downloaded code with the device or scanner your audience will use.",
    ],
    processing: "The QR code is generated locally with the qrcode library. Your text is not sent anywhere.",
    order: 9,
    featured: true,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    summary: "Count words, characters, sentences, and reading time.",
    description:
      "Get live counts for words, characters with and without spaces, sentences, and paragraphs while you type, along with an estimated reading time.",
    category: "text",
    icon: "type-count",
    href: "/tools/word-counter",
    status: "available",
    keywords: ["word counter", "character counter", "count words", "reading time", "text"],
    steps: [
      "Paste or type your text into the editor.",
      "Watch the counts update as you write.",
      "Copy the text or clear the editor when you are done.",
    ],
    limits: [
      "Reading time assumes 200 words per minute, a common average for adult readers.",
      "Paragraphs are counted as non-empty lines.",
      "Words and sentences use Unicode-aware segmentation where the browser supports it.",
    ],
    processing: "All counting happens in your browser as you type. Text is never transmitted.",
    order: 10,
    featured: false,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    summary: "Switch text between common casing styles.",
    description:
      "Convert text to lower, upper, title, sentence, camel, Pascal, snake, kebab, or CONSTANT case. Useful for labels, identifiers, and cleanup.",
    category: "text",
    icon: "case",
    href: "/tools/case-converter",
    status: "available",
    keywords: ["case converter", "camelcase", "snake case", "title case", "uppercase", "lowercase"],
    steps: [
      "Paste or type your text.",
      "Choose a casing style.",
      "Copy the converted result.",
    ],
    limits: [
      "Identifier styles (camel, snake, kebab) split on spaces, punctuation, and case boundaries.",
      "Very large inputs may feel slower in the browser.",
    ],
    processing: "Conversion runs entirely in your browser. Nothing is uploaded.",
    order: 11,
    featured: true,
  },
  {
    slug: "uuid-password-generator",
    name: "UUID & Password Generator",
    summary: "Create UUIDs and strong random passwords locally.",
    description:
      "Generate UUID v4 values and configurable passwords with length and character-set controls. Uses the Web Crypto API when available.",
    category: "developer",
    icon: "key",
    href: "/tools/uuid-password-generator",
    status: "available",
    keywords: ["uuid", "password generator", "random password", "guid", "secure password"],
    steps: [
      "Generate a new UUID or adjust password options.",
      "Create a password with the character sets you need.",
      "Copy the value you need.",
    ],
    limits: [
      "Password length is limited to keep the interface responsive.",
      "Randomness depends on the browser crypto APIs.",
    ],
    processing: "Values are generated on this device. Nothing is sent to a server.",
    order: 12,
    featured: true,
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    summary: "Convert between HEX, RGB, and HSL.",
    description:
      "Paste a hex or rgb() color, pick a swatch, and copy HEX, RGB, and HSL representations.",
    category: "developer",
    icon: "palette",
    href: "/tools/color-converter",
    status: "available",
    keywords: ["color converter", "hex to rgb", "hsl", "color picker", "hex color"],
    steps: [
      "Enter a hex or rgb color, or use the color picker.",
      "Review HEX, RGB, and HSL values.",
      "Copy the format you need.",
    ],
    limits: [
      "Alpha channels are not represented in the output formats.",
      "Invalid input is rejected with a clear message.",
    ],
    processing: "Color math runs in your browser only.",
    order: 13,
    featured: false,
  },
  {
    slug: "markdown-preview",
    name: "Markdown Preview",
    summary: "Preview a safe subset of Markdown as you type.",
    description:
      "Write Markdown on the left and see a live HTML preview on the right. Supports headings, lists, emphasis, code, and links.",
    category: "text",
    icon: "markdown",
    href: "/tools/markdown-preview",
    status: "available",
    keywords: ["markdown preview", "markdown editor", "md preview", "readme preview"],
    steps: [
      "Paste or write Markdown in the editor.",
      "Review the live preview.",
      "Edit until the preview matches what you need.",
    ],
    limits: [
      "Only a focused subset of Markdown is supported.",
      "Raw HTML in the source is escaped for safety.",
    ],
    processing: "Rendering happens locally in your browser.",
    order: 14,
    featured: false,
  },
  {
    slug: "csv-json-converter",
    name: "CSV ↔ JSON Converter",
    summary: "Convert tables between CSV and JSON.",
    description:
      "Turn CSV into a JSON array of objects, or JSON objects back into CSV. Handy for spreadsheets and APIs.",
    category: "developer",
    icon: "table",
    href: "/tools/csv-json-converter",
    status: "available",
    keywords: ["csv to json", "json to csv", "csv converter", "json table"],
    steps: [
      "Choose CSV → JSON or JSON → CSV.",
      "Paste your data and convert.",
      "Copy the result.",
    ],
    limits: [
      "JSON → CSV expects an array of objects.",
      "Very large tables may be slower in the browser.",
    ],
    processing: "Parsing and conversion stay on this device.",
    order: 15,
    featured: false,
  },
];

const toolMap = new Map<string, ToolDefinition>(tools.map((tool) => [tool.slug, tool]));

export function getTool(slug: string): ToolDefinition | undefined {
  return toolMap.get(slug);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return toolMap.get(slug);
}

export function getToolsByCategory(category: CategorySlug): ToolDefinition[] {
  return tools.filter((tool) => tool.category === category).sort((a, b) => a.order - b.order);
}

export function getFeaturedTools(): ToolDefinition[] {
  return tools.filter((tool) => tool.featured).sort((a, b) => a.order - b.order);
}

export function getRelatedTools(tool: ToolDefinition, count = 3): ToolDefinition[] {
  const sameCategory = tools.filter(
    (candidate) => candidate.category === tool.category && candidate.slug !== tool.slug,
  );
  const otherCategories = tools.filter(
    (candidate) => candidate.category !== tool.category && candidate.slug !== tool.slug,
  );
  return [...sameCategory, ...otherCategories].slice(0, count);
}

export function getCategoryCount(category: CategorySlug): number {
  return tools.filter((tool) => tool.category === category).length;
}
