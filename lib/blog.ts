import { countWords, estimateReadingMinutes } from "./text-stats";
import type { ToolSlug } from "./tools";

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
  code?: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  updated: string;
  tags: string[];
  relatedToolSlugs: ToolSlug[];
  sections: ArticleSection[];
}

export const articles: Article[] = [
  {
    slug: "browser-based-file-tools",
    title: "Why browser-based file tools are worth choosing",
    description:
      "Where your files actually go when you use an online tool, what changes when processing happens locally, and a practical checklist to use before you upload anything.",
    updated: "2026-10-12",
    tags: ["Privacy", "How it works"],
    relatedToolSlugs: ["image-compressor", "pdf-merger", "base64-encoder"],
    sections: [
      {
        heading: "The short version",
        paragraphs: [
          "When you drop a file into a website, something has to read and transform it. The question worth asking is where that work happens. Many online utilities send the file to a server, process it there, and send the result back. Others — including every file tool on ToolVerse — keep the work in the browser tab you already have open.",
          "That distinction matters because a file you are working with might contain a contract, a medical scan, a client logo, or a folder of personal photos. Local processing removes an entire category of risk: there is no upload step to trust, no temporary server copy to be deleted, and no queue that someone else can see.",
        ],
      },
      {
        heading: "What happens with a typical online converter",
        paragraphs: [
          "In a server-based workflow, selecting a file usually starts an upload. The bytes travel over the network to an application server, the server writes them somewhere — memory, a temporary directory, or object storage — and a worker process produces the output. The result is then sent back to you and, eventually, the server copies are cleaned up according to whatever retention policy the service uses.",
          "This model is not automatically bad. Server processing can be much faster for heavy jobs, and it works on devices that lack memory or processing power. The trade-off is that your file left your control, even if only for a moment. You are relying on the operator's security, logging, and cleanup practices.",
        ],
      },
      {
        heading: "What local processing changes",
        paragraphs: [
          "Modern browsers can do far more than display pages. They can decode images, resize them on a canvas, parse and rewrite PDF files, run a QR encoder, and handle text encodings such as UTF-8 and Base64 without any help from a server.",
        ],
        bullets: [
          "Your file never crosses the network, so there is no upload to intercept or retain.",
          "Tools usually respond immediately because there is no round trip and no queue position.",
          "The tools keep working when the network is slow, once the page itself has loaded.",
          "The limits are your device's memory and the browser's own format support.",
        ],
        note: "Local processing is not magic. Large PDFs and high-resolution images still need memory, and the browser can only produce formats it knows how to encode.",
      },
      {
        heading: "When a server still makes sense",
        paragraphs: [
          "Some jobs genuinely need infrastructure: optical character recognition on hundreds of scanned pages, video transcoding, or converting between exotic document formats. If a task depends on specialized libraries or serious compute, a server may be the practical choice.",
          "In those cases, the useful move is transparency. A good service explains what leaves your device, why it has to, how long it is kept, and what happens to it afterwards. Vague privacy language is not the same as a clear data flow.",
        ],
      },
      {
        heading: "A quick checklist before you upload",
        paragraphs: [
          "If you are about to use an online tool and you are not sure where processing happens, run through four questions:",
        ],
        bullets: [
          "Does the page say the file stays on your device, and does the behavior match that claim?",
          "Is there a stated file-size limit, and is it explained rather than hidden?",
          "Can you use the tool with the network disconnected after the page loads?",
          "Does the privacy policy describe actual behavior, or just promise to be trustworthy?",
        ],
      },
      {
        heading: "How ToolVerse fits",
        paragraphs: [
          "ToolVerse is built as a set of focused browser tools. PDF merging and splitting use pdf-lib in the tab, image tools use the canvas API, and the text and data tools operate on strings in memory. The privacy page describes exactly that behavior, including the limits that come with it.",
          "You can confirm the model yourself: open a tool, turn off your network connection, and process a file. If it still works, the processing was local.",
        ],
      },
    ],
  },
  {
    slug: "merging-and-splitting-pdfs",
    title: "Merging and splitting PDFs without surprises",
    description:
      "A practical guide to combining documents in the right order, extracting exactly the pages you need, and handling encrypted or damaged files.",
    updated: "2026-10-14",
    tags: ["PDF", "Guides"],
    relatedToolSlugs: ["pdf-merger", "pdf-splitter", "jpg-to-png"],
    sections: [
      {
        heading: "What merging actually does",
        paragraphs: [
          "A PDF is a container. It holds page descriptions, fonts, images, and metadata, and it can contain more than one of each. Merging reads the pages from each source document and writes them, in order, into a new container.",
          "Merging does not re-compress images or re-render text. Pages keep their original content streams, so quality is preserved. What can change is document-level metadata such as title, author, or bookmarks; ToolVerse creates a clean output document rather than trying to merge metadata from several sources.",
        ],
      },
      {
        heading: "Order is part of the document",
        paragraphs: [
          "A merged PDF is only as useful as its page order. Before merging, look at each file's page count and think about the sequence the reader will experience. A signed cover letter belongs before the exhibits it refers to; an invoice belongs before its supporting receipts.",
          "In the PDF Merger, every file in the list is merged from top to bottom. Use the move controls to rearrange files, and remove anything that was added by mistake. It is easier to fix the order before merging than to split and re-merge afterwards.",
        ],
      },
      {
        heading: "Describing the pages you want to keep",
        paragraphs: [
          "The PDF Splitter accepts a simple selection language that covers most real work:",
        ],
        bullets: [
          "A single page: 4",
          "A range: 4-9",
          "A mix of both: 1-2, 7, 12-14",
        ],
        note: "Selections are combined in document order. Asking for 9, 2, 4 produces a three-page PDF in the order 2, 4, 9.",
      },
      {
        heading: "Page numbers come from the document, not the label",
        paragraphs: [
          "Page numbers in a PDF viewer count physical pages. Printed page numbers — the ones in the footer — often start later, skip the cover, or use roman numerals for front matter. When in doubt, scroll the PDF and check which physical page you are looking at.",
          "If you need the first page as a separate file and the rest as another, run two extractions: one for page 1, and one for 2 to the final page.",
        ],
      },
      {
        heading: "Encrypted and damaged files",
        paragraphs: [
          "PDFs can be protected in two ways. A permissions password restricts printing or copying but usually allows reading; an open password encrypts the file until the password is entered. Tools that rely on standard PDF libraries cannot read an open-password document without the password, and they should say so clearly rather than failing silently.",
          "Damaged files are a different problem. A truncated download or a file that was renamed to .pdf will fail to parse. If a PDF opens in one viewer but not in another, the file may be using an unsupported feature or contain a broken cross-reference table.",
        ],
      },
      {
        heading: "A short pre-flight checklist",
        paragraphs: ["Before you merge or split, take thirty seconds to check the basics:"],
        bullets: [
          "Open each source PDF and confirm it is the right version.",
          "Count the pages and write down the ranges you need.",
          "Check whether any file is password-protected.",
          "Merge or split, then open the result and verify the first and last pages.",
        ],
      },
    ],
  },
  {
    slug: "json-syntax-and-schema",
    title: "JSON syntax, schemas, and the difference that matters",
    description:
      "How to read JSON parse errors, why a valid document can still be wrong, and when formatting or minifying actually helps.",
    updated: "2026-10-16",
    tags: ["Developer", "JSON"],
    relatedToolSlugs: ["json-formatter", "json-validator", "base64-encoder"],
    sections: [
      {
        heading: "Two different questions",
        paragraphs: [
          "JSON validation gets confusing because the word is used for two separate checks. Syntax validation asks whether the text can be parsed at all. Schema validation asks whether the parsed data has the right shape: required fields present, correct types, allowed values.",
          "ToolVerse validates syntax. If your JSON parses, the validator reports it as valid, even if it is missing a field your application expects. That is not a shortcoming; it is a different job, and mixing the two would be misleading.",
        ],
      },
      {
        heading: "Common syntax mistakes",
        paragraphs: ["Nearly every parse error comes from a small set of habits carried over from JavaScript:"],
        bullets: [
          "Trailing commas: { \"a\": 1, } is invalid in JSON, even though JavaScript allows it in some contexts.",
          "Single quotes: JSON strings and keys must use double quotes.",
          "Unquoted keys: { name: \"Ada\" } is JavaScript object syntax, not JSON.",
          "Comments: // and /* */ comments are not part of the JSON specification.",
          "Undefined values: the literal undefined does not exist in JSON.",
        ],
      },
      {
        heading: "Reading a parse error",
        paragraphs: [
          "A JSON parser stops at the first problem it finds and reports a position. The message is often terse — something like “Expected property name or '}'” — but the location is the useful part.",
          "A line and column turns a vague error into a specific character. Look just before the reported position as well: an unexpected comma or closing brace is frequently the result of a missing value on the previous line.",
        ],
        code: `{
  "name": "Ada",
  "roles": ["engineer", "writer",]
}`,
        note: "The trailing comma after the last array item is the only problem here. The parser reports the bracket that follows it, not the comma itself.",
      },
      {
        heading: "Formatting and minifying",
        paragraphs: [
          "Formatting adds indentation and line breaks so a human can read the structure. It changes whitespace only; the parsed value is identical. Minifying removes insignificant whitespace to make the payload smaller for transport or storage.",
          "Neither operation changes your data. If formatting changes a visible value, something else went wrong — usually a number that was already outside JavaScript's safe integer range, or duplicate keys where one value silently wins.",
        ],
      },
      {
        heading: "When you need schema validation",
        paragraphs: [
          "If you are checking an API payload or a configuration file, syntax is only the first gate. A schema — JSON Schema, Zod, or a type system — describes the expected structure and produces a meaningful error when a field is missing or has the wrong type.",
          "A practical workflow is to validate syntax first in a tool like this one, then run the parsed value through your schema in the application. The parser handles malformed text; the schema handles malformed meaning.",
        ],
      },
      {
        heading: "Habits that prevent problems",
        paragraphs: ["A few small practices remove most JSON pain:"],
        bullets: [
          "Keep one source of truth and format it consistently.",
          "Use a parser rather than string concatenation to build JSON.",
          "Treat numbers as numbers, and quote anything that must preserve leading zeros.",
          "Validate early in the pipeline, where the error message can still point at the source.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticleReadingMinutes(article: Article): number {
  const text = [
    article.title,
    article.description,
    ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.bullets ?? [])]),
  ].join(" ");
  return estimateReadingMinutes(countWords(text));
}

export function getSortedArticles(): Article[] {
  return [...articles].sort((a, b) => (a.updated < b.updated ? 1 : -1));
}
