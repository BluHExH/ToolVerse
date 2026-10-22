"use client";

import { useState } from "react";
import { ArrowLeftRight, Binary, Download, Eraser } from "lucide-react";
import { BASE64_MAX_CHARACTERS, decodeBase64Utf8, encodeBase64Utf8 } from "@/lib/base64";
import { downloadText } from "@/lib/download";
import { formatNumber } from "@/lib/format";
import { Notice } from "@/components/notice";
import { CopyButton } from "./copy-button";
import { JsonTextArea } from "./json-fields";
import { ResultBar, StepBlock, Workspace } from "./workspace";

type Mode = "encode" | "decode";

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

export default function Base64Encoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  const switchMode = (next: Mode) => {
    setMode(next);
    setOutput("");
    setError(null);
    setStatus("idle");
  };

  const convert = () => {
    const result = mode === "encode" ? encodeBase64Utf8(input) : decodeBase64Utf8(input);
    if (result.ok) {
      setOutput(result.value);
      setError(null);
      setStatus("done");
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

  const useResultAsInput = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError(null);
    setStatus("idle");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <Workspace
      title={mode === "encode" ? "Encode text to Base64" : "Decode Base64 to text"}
      icon={<Binary size={16} aria-hidden="true" />}
      actions={
        <button type="button" className="btn btn--quiet btn--sm" onClick={clearAll} disabled={!input && !output}>
          <Eraser size={15} aria-hidden="true" /> Clear
        </button>
      }
      footer={
        <>
          <span className="workspace__footer-note">
            {mode === "encode"
              ? `Text is encoded as UTF-8 first, so Unicode is preserved. Limit: ${formatNumber(
                  BASE64_MAX_CHARACTERS,
                )} characters.`
              : "Whitespace and missing padding are accepted. The decoded bytes must be valid UTF-8."}
          </span>
          <span className="workspace__footer-note" role="status" aria-live="polite">
            {status === "done" ? "Conversion complete" : null}
          </span>
        </>
      }
    >
      <StepBlock step="Step 01" title="Choose a direction">
        <div className="radio-row" role="radiogroup" aria-label="Conversion direction">
          <label className="radio-pill">
            <input
              type="radio"
              name="base64-mode"
              value="encode"
              checked={mode === "encode"}
              onChange={() => switchMode("encode")}
            />
            <span>Text → Base64</span>
          </label>
          <label className="radio-pill">
            <input
              type="radio"
              name="base64-mode"
              value="decode"
              checked={mode === "decode"}
              onChange={() => switchMode("decode")}
            />
            <span>Base64 → Text</span>
          </label>
        </div>
      </StepBlock>

      <StepBlock step="Step 02" title={mode === "encode" ? "Enter text" : "Paste Base64"}>
        <JsonTextArea
          label={mode === "encode" ? "Plain text input" : "Base64 input"}
          hint={mode === "encode" ? "Unicode supported" : "Standard Base64"}
          value={input}
          onChange={(value) => {
            setInput(value);
            setOutput("");
            setError(null);
            setStatus("idle");
          }}
          placeholder={mode === "encode" ? "Hello, world! 👋" : "SGVsbG8sIHdvcmxkIQ=="}
          invalid={Boolean(error)}
          rows={8}
        />
      </StepBlock>

      <StepBlock
        step="Step 03"
        title="Convert and use the result"
        actions={
          <>
            <button type="button" className="btn btn--accent" onClick={convert} disabled={!input.trim()}>
              <Binary size={16} aria-hidden="true" />
              {mode === "encode" ? "Encode to Base64" : "Decode to text"}
            </button>
            {output ? (
              <>
                <CopyButton text={output} label="Copy result" className="btn btn--secondary" />
                <button type="button" className="btn btn--secondary" onClick={useResultAsInput}>
                  <ArrowLeftRight size={16} aria-hidden="true" /> Use result as input
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() =>
                    downloadText(
                      output,
                      mode === "encode" ? "toolverse-base64.txt" : "toolverse-decoded.txt",
                    )
                  }
                >
                  <Download size={16} aria-hidden="true" /> Download
                </button>
              </>
            ) : null}
          </>
        }
      >
        {error ? <Notice tone="error" title="This input could not be converted">{error}</Notice> : null}

        {output ? (
          <>
            <JsonTextArea label="Result" value={output} readOnly rows={8} />
            <div className="stat-grid">
              <ResultBar label="Input characters" value={formatNumber(input.length)} />
              <ResultBar label="Input bytes" value={formatNumber(byteLength(input))} hint="UTF-8" />
              <ResultBar label="Output characters" value={formatNumber(output.length)} />
              <ResultBar label="Output bytes" value={formatNumber(byteLength(output))} hint="UTF-8" />
            </div>
          </>
        ) : null}

        {!output && !error ? (
          <p className="muted" style={{ fontSize: "0.87rem" }}>
            Conversion happens in this tab. Base64 is an encoding, not encryption — it hides nothing from anyone who
            has the value.
          </p>
        ) : null}
      </StepBlock>
    </Workspace>
  );
}
