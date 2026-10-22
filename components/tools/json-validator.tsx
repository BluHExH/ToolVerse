"use client";

import { useState } from "react";
import { BadgeCheck, Eraser, ScanSearch } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { parseJsonText, summarizeJsonValue, type JsonParseError } from "@/lib/json";
import { Notice } from "@/components/notice";
import { JsonErrorDetails, JsonTextArea } from "./json-fields";
import { ResultBar, StepBlock, Workspace } from "./workspace";

const INVALID_EXAMPLE = `{
  "name": "ToolVerse",
  "tools": ["pdf", "json",],
}`;

interface ValidationSummary {
  type: string;
  keys: number | null;
  items: number | null;
  depth: number;
  lines: number;
  characters: number;
}

export default function JsonValidator() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<JsonParseError | null>(null);
  const [summary, setSummary] = useState<ValidationSummary | null>(null);
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");

  const validate = () => {
    const result = parseJsonText(input);
    if (result.ok) {
      const details = summarizeJsonValue(result.value);
      setSummary({
        ...details,
        lines: input.split("\n").length,
        characters: input.length,
      });
      setError(null);
      setStatus("valid");
    } else {
      setSummary(null);
      setError(result.error);
      setStatus("invalid");
    }
  };

  const clearAll = () => {
    setInput("");
    setError(null);
    setSummary(null);
    setStatus("idle");
  };

  return (
    <Workspace
      title="Validate JSON syntax"
      icon={<BadgeCheck size={16} aria-hidden="true" />}
      actions={
        <>
          <button type="button" className="btn btn--quiet btn--sm" onClick={() => setInput(INVALID_EXAMPLE)}>
            Load example with an error
          </button>
          <button type="button" className="btn btn--quiet btn--sm" onClick={clearAll} disabled={!input}>
            <Eraser size={15} aria-hidden="true" /> Clear
          </button>
        </>
      }
      footer={
        <>
          <span className="workspace__footer-note">
            {input ? `${formatNumber(input.length)} characters` : "Paste JSON to check its syntax"}
          </span>
          <span className="workspace__footer-note" role="status" aria-live="polite">
            {status === "valid" ? "Valid JSON" : null}
            {status === "invalid" ? "Invalid JSON" : null}
          </span>
        </>
      }
    >
      <StepBlock step="Step 01" title="Paste JSON">
        <JsonTextArea
          label="JSON input"
          hint="Ctrl/⌘ + Enter to validate"
          value={input}
          onChange={(value) => {
            setInput(value);
            setStatus("idle");
            setError(null);
            setSummary(null);
          }}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault();
              validate();
            }
          }}
          placeholder={'{\n  "name": "ToolVerse"\n}'}
          invalid={Boolean(error)}
          rows={12}
        />
      </StepBlock>

      <StepBlock
        step="Step 02"
        title="Check the JSON"
        actions={
          <button type="button" className="btn btn--accent" onClick={validate} disabled={!input.trim()}>
            <ScanSearch size={16} aria-hidden="true" /> Validate JSON
          </button>
        }
      >
        {status === "valid" && summary ? (
          <Notice tone="success" title="Valid JSON">
            The input parses successfully. This check covers JSON syntax only — it does not verify a schema or required
            fields.
          </Notice>
        ) : null}

        {status === "invalid" && error ? (
          <Notice tone="error" title="Invalid JSON">
            <JsonErrorDetails error={error} />
          </Notice>
        ) : null}

        {status === "idle" ? (
          <p className="muted" style={{ fontSize: "0.87rem" }}>
            Validation parses the text with the browser&apos;s JSON parser. Your input stays in this tab.
          </p>
        ) : null}

        {status === "valid" && summary ? (
          <div className="stat-grid">
            <ResultBar label="Top-level type" value={summary.type} />
            <ResultBar
              label={summary.type === "array" ? "Items" : "Keys"}
              value={formatNumber(summary.keys ?? summary.items ?? 0)}
            />
            <ResultBar label="Nesting depth" value={String(summary.depth)} />
            <ResultBar label="Lines" value={formatNumber(summary.lines)} />
            <ResultBar label="Characters" value={formatNumber(summary.characters)} />
          </div>
        ) : null}
      </StepBlock>

      <StepBlock step="Step 03" title="What this check means">
        <ul className="note-list">
          <li>
            <BadgeCheck size={17} aria-hidden="true" />
            <span>
              <strong>Syntax validation</strong> answers one question: can this text be parsed as JSON? It confirms
              structure, not meaning.
            </span>
          </li>
          <li>
            <BadgeCheck size={17} aria-hidden="true" />
            <span>
              <strong>Schema validation</strong> is a separate step. It checks required fields, types, and allowed
              values after the text parses successfully.
            </span>
          </li>
        </ul>
      </StepBlock>
    </Workspace>
  );
}
