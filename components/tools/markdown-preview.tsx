"use client";

import { useMemo, useState } from "react";
import { BookOpenText, Eraser } from "lucide-react";
import { markdownToHtml } from "@/lib/markdown";
import { Workspace } from "./workspace";

const SAMPLE = `# Heading

Write **bold**, *italic*, and \`inline code\`.

- List item one
- List item two

\`\`\`
code block
\`\`\`

[ToolVerse](https://example.com)
`;

export default function MarkdownPreview() {
  const [source, setSource] = useState(SAMPLE);
  const html = useMemo(() => markdownToHtml(source), [source]);

  return (
    <Workspace
      title="Preview Markdown"
      icon={<BookOpenText size={16} aria-hidden="true" />}
      actions={
        <button type="button" className="btn btn--quiet btn--sm" onClick={() => setSource("")} disabled={!source}>
          <Eraser size={15} aria-hidden="true" /> Clear
        </button>
      }
      footer={
        <span className="workspace__footer-note">
          Supports headings, lists, bold, italic, code, and links. HTML is escaped for safety.
        </span>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
          gap: "1rem",
        }}
      >
        <div className="field">
          <label className="field__label" htmlFor="md-source">
            Markdown
          </label>
          <textarea
            id="md-source"
            className="textarea code-area"
            rows={16}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="field">
          <span className="field__label">Preview</span>
          <div
            className="prose"
            style={{
              minHeight: "18rem",
              padding: "1rem",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              background: "var(--surface)",
            }}
            // Safe: markdownToHtml escapes raw HTML before applying a limited subset.
            dangerouslySetInnerHTML={{ __html: html || "<p class='muted'>Nothing to preview yet.</p>" }}
          />
        </div>
      </div>
    </Workspace>
  );
}
