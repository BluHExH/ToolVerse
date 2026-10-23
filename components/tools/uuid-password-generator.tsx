"use client";

import { useState } from "react";
import { KeyRound, RefreshCw } from "lucide-react";
import { generatePassword, generateUuid } from "@/lib/generators";
import { CopyButton } from "./copy-button";
import { Workspace } from "./workspace";

export default function UuidPasswordGenerator() {
  const [uuid, setUuid] = useState(() => generateUuid());
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState(() =>
    generatePassword({ length: 16, lower: true, upper: true, digits: true, symbols: false }),
  );

  const refreshPassword = () => {
    setPassword(generatePassword({ length, lower, upper, digits, symbols }));
  };

  return (
    <Workspace
      title="Generate UUID and passwords"
      icon={<KeyRound size={16} aria-hidden="true" />}
      footer={
        <span className="workspace__footer-note">
          Values are generated on this device with the Web Crypto API when available.
        </span>
      }
    >
      <div className="step-block">
        <div className="step-block__head">
          <span className="step-block__num" aria-hidden="true">
            01
          </span>
          <h3 className="step-block__title">UUID v4</h3>
        </div>
        <div className="field">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => setUuid(generateUuid())}>
              <RefreshCw size={14} aria-hidden="true" /> New UUID
            </button>
            <CopyButton text={uuid} />
          </div>
          <input className="textarea" style={{ minHeight: "3rem" }} value={uuid} readOnly aria-label="Generated UUID" />
        </div>
      </div>

      <div className="step-block">
        <div className="step-block__head">
          <span className="step-block__num" aria-hidden="true">
            02
          </span>
          <h3 className="step-block__title">Password</h3>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="pw-length">
            Length: {length}
          </label>
          <input
            id="pw-length"
            className="range-input"
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>

        <div className="checkbox-row">
          <label>
            <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} /> Lowercase
          </label>
          <label>
            <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase
          </label>
          <label>
            <input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} /> Digits
          </label>
          <label>
            <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> Symbols
          </label>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <button type="button" className="btn btn--secondary btn--sm" onClick={refreshPassword}>
            <RefreshCw size={14} aria-hidden="true" /> Generate
          </button>
          <CopyButton text={password} />
        </div>
        <input
          className="textarea mono"
          style={{ minHeight: "3rem" }}
          value={password}
          readOnly
          aria-label="Generated password"
        />
      </div>
    </Workspace>
  );
}
