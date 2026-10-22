"use client";

import { useState } from "react";
import { Braces, Download, Eraser, FileJson, WandSparkles } from "lucide-react";
import { downloadText } from "@/lib/download";
import { formatNumber } from "@/lib/format";
import { minifyJsonText, parseJsonText, summarizeJsonValue, type JsonParseError } from "@/lib/json";
import { Notice } from "@/components/notice";
import { CopyButton } from "./copy-button";
import { JsonErrorDetails, JsonTextArea } from "./json-fields";
import { ResultBar, StepBlock, Workspace } from "./workspace";

const EXAMPLE = `{"project":"ToolVerse","tools":[{"name":"JSON Formatter","local":true},{"name":"Word Counter","local":true}],"version":1}`;

type IndentOption = "2" | "4" | "tab";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<IndentOption>("2");
  const [error, setError] = useState<JsonParseError | null>(null);
  const [status, setStatus] = useState<"idle" | "formatted" | "minified" | "error">("idle");

  const run = (mode: "format" | "minify") => {
    const result = mode === "format" ? parseJsonText(input, indent) : minifyJsonText(input);
    if (result.ok) {
      setOutput(result.formatted);
      setError(null);
      setStatus(mode === "format" ? "formatted" : "minified");
    } else {
      setOutput("");
      setError(result.error);
      setStatus("error");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
    setStatus("idle");
  };

  const summary = output ? summarizeJsonValue(JSON.parse(output)) : null;
  const outputLines = output ? output.split("\n").length : 0;

  const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      run("format");
    }
  };

  return (
    <Workspace
      title="Format JSON"
      icon={<Braces size={16} aria-hidden="true" />}
      actions={
        <>
          <button type="button" className="btn btn--quiet btn--sm" onClick={() => setInput(EXAMPLE)}>
            <FileJson size={15} aria-hidden="true" /> Load example
          </button>
          <button type="button" className="btn btn--quiet btn--sm" onClick={clearAll} disabled={!input && !output}>
            <Eraser size={15} aria-hidden="true" /> Clear
          </button>
        </>
      }
      footer={
        <>
          <span className="workspace__footer-note">
            {input ? `${formatNumber(input.length)} input characters` : "Paste JSON to begin"}
          </span>
          <span className="workspace__footer-note" role="status" aria-live="polite">
            {status === "formatted" ? "Formatted" : null}
            {status === "minified" ? "Minified" : null}
          </span>
        </>
      }
    >
      <StepBlock step="Step 01" title="Paste JSON">
        <JsonTextArea
          label="JSON input"
          hint="Ctrl/⌘ + Enter to format"
          value={input}
          onChange={(value) => {
            setInput(value);
            setError(null);
            setStatus("idle");
          }}
          onKeyDown={handleEditorKeyDown}
          placeholder={'{"name":"ToolVerse","local":true}'}
          invalid={Boolean(error)}
          rows={11}
        />
      </StepBlock>

      <StepBlock
        step="Step 02"
        title="Choose an action"
        actions={
          <>
            <button type="button" className="btn btn--accent" onClick={() => run("format")} disabled={!input.trim()}>
              <WandSparkles size={16} aria-hidden="true" /> Format
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => run("minify")} disabled={!input.trim()}>
              <Braces size={16} aria-hidden="true" /> Minify
            </button>
            {output ? (
              <>
                <CopyButton text={output} label="Copy output" className="btn btn--secondary" />
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => downloadText(output, "toolverse-formatted.json", "application/json")}
                >
                  <Download size={16} aria-hidden="true" /> Download .json
                </button>
              </>
            ) : null}
          </>
        }
      >
        <div className="radio-row" role="radiogroup" aria-label="Indentation">
          {(
            [
              ["2", "2 spaces"],
              ["4", "4 spaces"],
              ["tab", "Tab"],
            ] as [IndentOption, string][]
          ).map(([value, label]) => (
            <label className="radio-pill" key={value}>
              <input
                type="radio"
                name="indent"
                value={value}
                checked={indent === value}
                onChange={() => {
                  setIndent(value);
                  if (status === "formatted") setStatus("idle");
                }}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        {error ? (
          <Notice tone="error" title="This JSON could not be parsed">
            <JsonErrorDetails error={error} />
          </Notice>
        ) : null}

        {!error ? (
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            Formatting changes whitespace only and preserves key order. Comments and trailing commas are not valid
            JSON.
          </p>
        ) : null}
      </StepBlock>

      {output ? (
        <StepBlock step="Step 03" title="Result">
          <JsonTextArea label="Formatted output" value={output} readOnly rows={14} />
          {summary ? (
            <div className="stat-grid">
              <ResultBar label="Top-level type" value={summary.type} />
              <ResultBar
                label={summary.type === "array" ? "Items" : "Keys"}
                value={formatNumber(summary.keys ?? summary.items ?? 0)}
              />
              <ResultBar label="Depth" value={String(summary.depth)} />
              <ResultBar label="Output lines" value={formatNumber(outputLines)} />
              <ResultBar label="Output size" value={`${formatNumber(output.length)} chars`} />
            </div>
          ) : null}
        </StepBlock>
      ) : null}
    </Workspace>
  );
}
