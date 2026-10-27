"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Eraser, QrCode, RotateCcw } from "lucide-react";
import { downloadBlob } from "@/lib/download";
import { formatNumber } from "@/lib/format";
import {
  QR_CONTRAST_RECOMMENDED,
  QR_SAFE_BACKGROUND,
  QR_SAFE_FOREGROUND,
  evaluateQrContrast,
  isValidHexColor,
  normalizeHexColor,
  suggestQrFileName,
  validateQrPayload,
} from "@/lib/qr";
import { Notice } from "@/components/notice";
import { JsonTextArea } from "./json-fields";
import { StepBlock, Workspace } from "./workspace";

const SIZES = [256, 512, 1024] as const;
const ECC_LEVELS = [
  { value: "L", label: "Low (L) — smallest code" },
  { value: "M", label: "Medium (M) — balanced" },
  { value: "Q", label: "Quartile (Q) — more robust" },
  { value: "H", label: "High (H) — most robust" },
] as const;

type EccLevel = (typeof ECC_LEVELS)[number]["value"];

const DEFAULTS = {
  foreground: QR_SAFE_FOREGROUND,
  background: QR_SAFE_BACKGROUND,
  size: 512 as (typeof SIZES)[number],
  ecc: "M" as EccLevel,
  margin: 4,
};

export default function QrCodeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const [foreground, setForeground] = useState(DEFAULTS.foreground);
  const [background, setBackground] = useState(DEFAULTS.background);
  const [size, setSize] = useState<(typeof SIZES)[number]>(DEFAULTS.size);
  const [ecc, setEcc] = useState<EccLevel>(DEFAULTS.ecc);
  const [margin, setMargin] = useState(DEFAULTS.margin);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [generating, setGenerating] = useState(false);

  const payloadError = validateQrPayload(text);
  const normalizedForeground = normalizeHexColor(foreground);
  const normalizedBackground = normalizeHexColor(background);

  let configError: string | null = null;
  if (!isValidHexColor(foreground) || !isValidHexColor(background)) {
    configError = "Enter valid hex colors such as #000000 or #FFFFFF.";
  }

  const contrast =
    normalizedForeground && normalizedBackground
      ? evaluateQrContrast(normalizedForeground, normalizedBackground)
      : null;

  // Auto-correct unreadable pairs so the tool never gets stuck on a contrast error.
  useEffect(() => {
    if (!normalizedForeground || !normalizedBackground) return;
    if (contrast?.level !== "poor") return;
    setForeground(QR_SAFE_FOREGROUND);
    setBackground(QR_SAFE_BACKGROUND);
  }, [contrast?.level, normalizedForeground, normalizedBackground]);

  const activeError = payloadError ?? configError;

  useEffect(() => {
    if (activeError || !text.trim() || !normalizedForeground || !normalizedBackground || !canvasRef.current) {
      setReady(false);
      return;
    }

    let cancelled = false;
    setGenerating(true);
    const timer = window.setTimeout(() => {
      QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin,
        errorCorrectionLevel: ecc,
        color: { dark: normalizedForeground, light: normalizedBackground },
      })
        .then(() => {
          if (!cancelled) {
            setReady(true);
            setGenerating(false);
          }
        })
        .catch((generationError: unknown) => {
          if (!cancelled) {
            setReady(false);
            setGenerating(false);
            setError(
              generationError instanceof Error
                ? `This payload is too large for a QR code with the current settings. ${generationError.message}`
                : "The QR code could not be generated. Try shorter text or a lower error-correction level.",
            );
          }
        });
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [text, size, margin, ecc, normalizedForeground, normalizedBackground, activeError]);

  useEffect(() => {
    if (activeError) {
      setError(null);
    }
  }, [activeError]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `${suggestQrFileName(text)}.png`);
      }
    }, "image/png");
  };

  const downloadSvg = async () => {
    if (!ready) return;
    try {
      const svg = await QRCode.toString(text, {
        type: "svg",
        margin,
        errorCorrectionLevel: ecc,
        color: { dark: normalizedForeground ?? DEFAULTS.foreground, light: normalizedBackground ?? DEFAULTS.background },
      });
      downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${suggestQrFileName(text)}.svg`);
    } catch {
      setError("The SVG version could not be generated. Try the PNG download instead.");
    }
  };

  const reset = () => {
    setText("");
    setForeground(DEFAULTS.foreground);
    setBackground(DEFAULTS.background);
    setSize(DEFAULTS.size);
    setEcc(DEFAULTS.ecc);
    setMargin(DEFAULTS.margin);
    setError(null);
  };

  return (
    <Workspace
      title="Generate a QR code"
      icon={<QrCode size={16} aria-hidden="true" />}
      actions={
        <button type="button" className="btn btn--quiet btn--sm" onClick={reset}>
          <RotateCcw size={15} aria-hidden="true" /> Reset
        </button>
      }
      footer={
        <>
          <span className="workspace__footer-note">
            {text ? `${formatNumber(new TextEncoder().encode(text).length)} payload bytes` : "Enter a URL or short text"}
          </span>
          <span className="workspace__footer-note" role="status" aria-live="polite">
            {generating ? "Generating…" : ready ? "QR code ready" : null}
          </span>
        </>
      }
    >
      <div className="code-grid">
        <StepBlock step="Step 01" title="Enter the payload">
          <JsonTextArea
            label="Text or URL"
            hint={`${formatNumber(new TextEncoder().encode(text).length)} / 2000 bytes`}
            value={text}
            onChange={(value) => {
              setText(value);
              setError(null);
            }}
            placeholder="https://example.com"
            invalid={Boolean(payloadError)}
            rows={7}
          />
          {payloadError ? (
            <Notice tone="error" title="This payload cannot be used">
              {payloadError}
            </Notice>
          ) : (
            <p className="muted" style={{ fontSize: "0.84rem" }}>
              Keep it short. A shorter payload produces a less dense code that is easier for cameras to read.
            </p>
          )}
        </StepBlock>

        <StepBlock step="Step 02" title="Adjust the appearance">
          <div className="form-grid__row">
            <div className="field">
              <label className="field__label" htmlFor="qr-size">
                Size
              </label>
              <select
                id="qr-size"
                className="select"
                value={size}
                onChange={(event) => setSize(Number(event.target.value) as (typeof SIZES)[number])}
              >
                {SIZES.map((option) => (
                  <option key={option} value={option}>
                    {option} × {option} px
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="qr-ecc">
                Error correction
              </label>
              <select
                id="qr-ecc"
                className="select"
                value={ecc}
                onChange={(event) => setEcc(event.target.value as EccLevel)}
              >
                {ECC_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid__row">
            <div className="field">
              <label className="field__label" htmlFor="qr-foreground">
                Foreground
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  id="qr-foreground"
                  type="color"
                  value={normalizedForeground ?? DEFAULTS.foreground}
                  onChange={(event) => setForeground(event.target.value)}
                  style={{
                    width: "3rem",
                    height: "2.7rem",
                    padding: "0.2rem",
                    border: "1px solid var(--line-strong)",
                    borderRadius: "8px",
                    background: "var(--surface)",
                    cursor: "pointer",
                  }}
                />
                <input
                  className="input mono"
                  type="text"
                  value={foreground}
                  aria-label="Foreground hex color"
                  spellCheck={false}
                  onChange={(event) => setForeground(event.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="qr-background">
                Background
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  id="qr-background"
                  type="color"
                  value={normalizedBackground ?? DEFAULTS.background}
                  onChange={(event) => setBackground(event.target.value)}
                  style={{
                    width: "3rem",
                    height: "2.7rem",
                    padding: "0.2rem",
                    border: "1px solid var(--line-strong)",
                    borderRadius: "8px",
                    background: "var(--surface)",
                    cursor: "pointer",
                  }}
                />
                <input
                  className="input mono"
                  type="text"
                  value={background}
                  aria-label="Background hex color"
                  spellCheck={false}
                  onChange={(event) => setBackground(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="qr-margin">
              Quiet zone
              <span className="field__hint">{margin} modules</span>
            </label>
            <input
              id="qr-margin"
              className="range-input"
              type="range"
              min={0}
              max={8}
              step={1}
              value={margin}
              onChange={(event) => setMargin(Number(event.target.value))}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => {
                setForeground(QR_SAFE_FOREGROUND);
                setBackground(QR_SAFE_BACKGROUND);
              }}
            >
              Use scanner-safe colors
            </button>
          </div>

          {contrast ? (
            <Notice
              tone={contrast.level === "good" ? "success" : contrast.level === "warning" ? "warning" : "info"}
              title={
                contrast.level === "good"
                  ? "Good contrast"
                  : contrast.level === "warning"
                    ? "Acceptable contrast"
                    : "Colors adjusted"
              }
            >
              Contrast ratio {contrast.ratio}:1.{" "}
              {contrast.level === "good"
                ? "This contrast is comfortable for scanners."
                : contrast.level === "warning"
                  ? `This can work, but at least ${QR_CONTRAST_RECOMMENDED}:1 is safer for print and small sizes.`
                  : "Low-contrast colors were switched to black on white so scanners can read the code."}
            </Notice>
          ) : null}

          {configError ? <Notice tone="error">{configError}</Notice> : null}
        </StepBlock>
      </div>

      <StepBlock
        step="Step 03"
        title="Preview and download"
        actions={
          <>
            <button type="button" className="btn btn--primary" onClick={downloadPng} disabled={!ready}>
              <Download size={16} aria-hidden="true" /> Download PNG
            </button>
            <button type="button" className="btn btn--secondary" onClick={downloadSvg} disabled={!ready}>
              <Download size={16} aria-hidden="true" /> Download SVG
            </button>
            {text ? (
              <button type="button" className="btn btn--quiet" onClick={() => setText("")}>
                <Eraser size={15} aria-hidden="true" /> Clear text
              </button>
            ) : null}
          </>
        }
      >
        {error ? <Notice tone="error" title="The QR code could not be generated">{error}</Notice> : null}
        <div className="preview-frame checkerboard">
          <canvas
            ref={canvasRef}
            aria-label={ready && text ? `QR code for ${text.slice(0, 80)}` : "QR code preview"}
            role="img"
          />
        </div>
        {!ready && !activeError && !text.trim() ? (
          <p className="muted" style={{ fontSize: "0.87rem" }}>
            Enter a URL or some text to generate a code. The code is created locally — your payload is never sent to a
            server.
          </p>
        ) : null}
        <p className="muted" style={{ fontSize: "0.84rem" }}>
          Always test the downloaded code with the scanner your audience will use, especially before printing.
        </p>
      </StepBlock>
    </Workspace>
  );
}
