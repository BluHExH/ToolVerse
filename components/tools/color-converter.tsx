"use client";

import { useMemo, useState } from "react";
import { Palette } from "lucide-react";
import {
  formatHsl,
  formatRgb,
  parseHex,
  parseRgbString,
  rgbToHex,
  rgbToHsl,
  type Rgb,
} from "@/lib/color";
import { CopyButton } from "./copy-button";
import { Notice } from "@/components/notice";
import { Workspace } from "./workspace";

function resolveColor(input: string): Rgb | null {
  return parseHex(input) ?? parseRgbString(input);
}

export default function ColorConverter() {
  const [input, setInput] = useState("#b8431f");
  const rgb = useMemo(() => resolveColor(input), [input]);
  const hex = rgb ? rgbToHex(rgb) : "";
  const hsl = rgb ? rgbToHsl(rgb) : null;

  return (
    <Workspace
      title="Convert colors"
      icon={<Palette size={16} aria-hidden="true" />}
      footer={<span className="workspace__footer-note">Accepts #hex or rgb(r, g, b).</span>}
    >
      <div className="field">
        <label className="field__label" htmlFor="color-input">
          Color
        </label>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <input
            id="color-input"
            className="textarea"
            style={{ minHeight: "3rem", flex: "1 1 12rem" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#b8431f or rgb(184, 67, 31)"
            spellCheck={false}
          />
          <input
            type="color"
            aria-label="Pick a color"
            value={hex || "#000000"}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: "3rem", height: "3rem", border: "1px solid var(--line)", borderRadius: "8px", padding: 0 }}
          />
        </div>
      </div>

      {!rgb ? (
        <Notice tone="warning" title="Unrecognized color">
          Enter a 3- or 6-digit hex value (with or without #) or an rgb() string.
        </Notice>
      ) : (
        <>
          <div
            aria-hidden="true"
            style={{
              height: "4.5rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--line)",
              background: hex,
            }}
          />
          <ResultRow label="HEX" value={hex} />
          <ResultRow label="RGB" value={formatRgb(rgb)} />
          <ResultRow label="HSL" value={hsl ? formatHsl(hsl) : ""} />
        </>
      )}
    </Workspace>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="field">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
        <span className="field__label">{label}</span>
        <CopyButton text={value} disabled={!value} />
      </div>
      <input className="textarea mono" style={{ minHeight: "2.75rem" }} value={value} readOnly aria-label={label} />
    </div>
  );
}
