"use client";

import { useState } from "react";
import { ArrowLeftRight, Eraser } from "lucide-react";
import { csvToJson, jsonToCsv } from "@/lib/csv-json";
import { CopyButton } from "./copy-button";
import { Notice } from "@/components/notice";
import { Workspace } from "./workspace";

const SAMPLE_CSV = `name,role,active
Ada,Engineer,true
Grace,Mathematician,true`;

export default function CsvJsonConverter() {
  const [mode, setMode] = useState<"csv-to-json" | "json-to-csv">("csv-to-json");
  const [input, setInput] = useState(SAMPLE_CSV);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
    const result = mode === "csv-to-json" ? csvToJson(input) : jsonToCsv(input);
    if (result.ok) {
      setOutput(result.value);
      setError(null);
    } else {
      setOutput("");
      setError(result.error);
    }
  };

  return (
    <Workspace
      title="Convert CSV and JSON"
      icon={<ArrowLeftRight size={16} aria-hidden="true" />}
      actions={
        <>
          <button
            type="button"
            className="btn btn--quiet btn--sm"
            onClick={() => {
              setInput(mode === "csv-to-json" ? SAMPLE_CSV : '[{"name":"Ada","role":"Engineer"}]');
              setOutput("");
              setError(null);
            }}
          >
            Load sample
          </button>
          <button
            type="button"
            className="btn btn--quiet btn--sm"
            onClick={() => {
              setInput("");
              setOutput("");
              setError(null);
            }}
            disabled={!input && !output}
          >
            <Eraser size={15} aria-hidden="true" /> Clear
          </button>
        </>
      }
      footer={<span className="workspace__footer-note">Parsing runs entirely in your browser.</span>}
    >
      <div className="radio-row" role="radiogroup" aria-label="Conversion direction">
        <label className="radio-pill">
          <input
            type="radio"
            name="csv-json-mode"
            checked={mode === "csv-to-json"}
            onChange={() => {
              setMode("csv-to-json");
              setOutput("");
              setError(null);
            }}
          />
          <span>CSV → JSON</span>
        </label>
        <label className="radio-pill">
          <input
            type="radio"
            name="csv-json-mode"
            checked={mode === "json-to-csv"}
            onChange={() => {
              setMode("json-to-csv");
              setOutput("");
              setError(null);
            }}
          />
          <span>JSON → CSV</span>
        </label>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="csv-json-input">
          Input
        </label>
        <textarea
          id="csv-json-input"
          className="textarea code-area"
          rows={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div>
        <button type="button" className="btn btn--primary" onClick={convert} disabled={!input.trim()}>
          Convert
        </button>
      </div>

      {error ? (
        <Notice tone="error" title="Could not convert">
          {error}
        </Notice>
      ) : null}

      <div className="field">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
          <label className="field__label" htmlFor="csv-json-output">
            Output
          </label>
          <CopyButton text={output} disabled={!output} />
        </div>
        <textarea id="csv-json-output" className="textarea code-area" rows={10} value={output} readOnly />
      </div>
    </Workspace>
  );
}
