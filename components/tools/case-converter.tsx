"use client";

import { useMemo, useState } from "react";
import { CaseSensitive, Eraser } from "lucide-react";
import { CASE_STYLES, convertCase, type CaseStyle } from "@/lib/case-convert";
import { CopyButton } from "./copy-button";
import { Workspace } from "./workspace";

const SAMPLE = "hello world example — ToolVerse case converter";

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<CaseStyle>("title");
  const output = useMemo(() => convertCase(input, style), [input, style]);

  return (
    <Workspace
      title="Convert text case"
      icon={<CaseSensitive size={16} aria-hidden="true" />}
      actions={
        <>
          <button type="button" className="btn btn--quiet btn--sm" onClick={() => setInput(SAMPLE)}>
            Load sample
          </button>
          <button type="button" className="btn btn--quiet btn--sm" onClick={() => setInput("")} disabled={!input}>
            <Eraser size={15} aria-hidden="true" /> Clear
          </button>
        </>
      }
      footer={
        <span className="workspace__footer-note" role="status">
          {output.length} characters in result
        </span>
      }
    >
      <div className="field">
        <label className="field__label" htmlFor="case-style">
          Style
        </label>
        <select
          id="case-style"
          className="select"
          value={style}
          onChange={(e) => setStyle(e.target.value as CaseStyle)}
        >
          {CASE_STYLES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="case-input">
          Input
        </label>
        <textarea
          id="case-input"
          className="textarea"
          rows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type text…"
        />
      </div>

      <div className="field">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
          <label className="field__label" htmlFor="case-output">
            Result
          </label>
          <CopyButton text={output} disabled={!output} />
        </div>
        <textarea id="case-output" className="textarea code-area" rows={8} value={output} readOnly />
      </div>
    </Workspace>
  );
}
