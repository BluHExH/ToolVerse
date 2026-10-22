"use client";

import { useEffect, useState } from "react";
import { Download, Image as ImageIcon, Scaling, Trash2 } from "lucide-react";
import { FILE_LIMITS, IMAGE_ACCEPT, validateImageFile } from "@/lib/files";
import { downloadBlob } from "@/lib/download";
import { formatBytes, formatNumber } from "@/lib/format";
import {
  IMAGE_FORMAT_LABELS,
  canvasSupportsMime,
  canvasToBlob,
  drawToCanvas,
  extensionForMime,
  fitToAspectRatio,
  loadImageFromFile,
  resolveOutputMime,
  validateDimensions,
  withSuffix,
  type ImageOutputFormat,
} from "@/lib/image";
import { useObjectUrl } from "@/hooks/use-object-url";
import { Notice } from "@/components/notice";
import { FilePicker } from "./file-picker";
import { ResultBar, StepBlock, Workspace } from "./workspace";

interface ResizedOutput {
  blob: Blob;
  width: number;
  height: number;
  fileName: string;
}

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [original, setOriginal] = useState<{ width: number; height: number } | null>(null);
  const [widthInput, setWidthInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [ratioLocked, setRatioLocked] = useState(true);
  const [format, setFormat] = useState<ImageOutputFormat>("original");
  const [quality, setQuality] = useState(85);
  const [issue, setIssue] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [output, setOutput] = useState<ResizedOutput | null>(null);

  const inputUrl = useObjectUrl(file);
  const outputUrl = useObjectUrl(output?.blob ?? null);
  const busy = status === "loading" || status === "working";

  useEffect(() => {
    if (!file) {
      setOriginal(null);
      return;
    }
    let revoke: (() => void) | null = null;
    let cancelled = false;
    setStatus("loading");
    loadImageFromFile(file)
      .then(({ image, revoke: revokeUrl }) => {
        revoke = revokeUrl;
        if (cancelled) return;
        const dimensions = { width: image.naturalWidth, height: image.naturalHeight };
        setOriginal(dimensions);
        setWidthInput(String(dimensions.width));
        setHeightInput(String(dimensions.height));
        setStatus("idle");
      })
      .catch(() => {
        if (!cancelled) {
          setIssue("The browser could not decode this image. Try a JPEG, PNG, or WebP file.");
          setFile(null);
          setStatus("idle");
        }
      });
    return () => {
      cancelled = true;
      revoke?.();
    };
  }, [file]);

  const clearOutput = () => {
    setOutput(null);
    setMessage(null);
    if (status === "done" || status === "error") setStatus("idle");
  };

  const addFile = (files: File[]) => {
    const candidate = files[0];
    if (!candidate) return;
    const validationError = validateImageFile(candidate);
    setIssue(validationError);
    setOutput(null);
    setMessage(null);
    if (!validationError) {
      setFile(candidate);
    }
  };

  const removeFile = () => {
    setFile(null);
    setIssue(null);
    setOriginal(null);
    setWidthInput("");
    setHeightInput("");
    clearOutput();
  };

  const updateWidth = (value: string) => {
    setWidthInput(value);
    if (ratioLocked && original) {
      const numeric = Number(value);
      if (Number.isFinite(numeric) && numeric > 0) {
        setHeightInput(String(fitToAspectRatio(numeric, original.width, original.height, "width")));
      }
    }
    clearOutput();
  };

  const updateHeight = (value: string) => {
    setHeightInput(value);
    if (ratioLocked && original) {
      const numeric = Number(value);
      if (Number.isFinite(numeric) && numeric > 0) {
        setWidthInput(String(fitToAspectRatio(numeric, original.width, original.height, "height")));
      }
    }
    clearOutput();
  };

  const applyScale = (scale: number) => {
    if (!original) return;
    setWidthInput(String(Math.max(1, Math.round(original.width * scale))));
    setHeightInput(String(Math.max(1, Math.round(original.height * scale))));
    clearOutput();
  };

  const resize = async () => {
    if (!file || !original) return;
    const width = Number(widthInput);
    const height = Number(heightInput);
    const validationError = validateDimensions(width, height);
    if (validationError) {
      setStatus("error");
      setMessage(validationError);
      return;
    }

    setStatus("working");
    setMessage(null);
    setOutput(null);

    try {
      const mimeType = resolveOutputMime(format, file.type);
      if (mimeType === "image/webp" && !(await canvasSupportsMime("image/webp"))) {
        setStatus("error");
        setMessage("This browser cannot encode WebP images. Choose JPEG, PNG, or keep the original format.");
        return;
      }
      const { image, revoke } = await loadImageFromFile(file);
      try {
        const useQuality = mimeType === "image/jpeg" || mimeType === "image/webp";
        const canvas = drawToCanvas(
          image,
          width,
          height,
          mimeType === "image/jpeg" ? "#ffffff" : undefined,
        );
        const blob = await canvasToBlob(canvas, mimeType, useQuality ? quality / 100 : undefined);
        setOutput({
          blob,
          width,
          height,
          fileName: withSuffix(file.name, `${width}x${height}`, extensionForMime(mimeType)),
        });
        setStatus("done");
        setMessage(`Resized to ${formatNumber(width)}×${formatNumber(height)} pixels.`);
      } finally {
        revoke();
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The image could not be resized.");
    }
  };

  const isUpscale =
    original && Number(widthInput) > original.width && Number(heightInput) > original.height;

  return (
    <Workspace
      title="Resize an image"
      icon={<Scaling size={16} aria-hidden="true" />}
      actions={
        file ? (
          <button type="button" className="btn btn--quiet btn--sm" onClick={removeFile} disabled={busy}>
            Remove image
          </button>
        ) : null
      }
      footer={
        <>
          <span className="workspace__footer-note">
            {file && original
              ? `${file.name} · original ${formatNumber(original.width)}×${formatNumber(original.height)} px`
              : `One image up to ${Math.round(FILE_LIMITS.maxImageBytes / (1024 * 1024))} MB`}
          </span>
          <span className="workspace__footer-note" role="status" aria-live="polite">
            {status === "working" ? "Resizing…" : null}
          </span>
        </>
      }
    >
      <StepBlock step="Step 01" title="Add an image">
        <FilePicker
          accept={IMAGE_ACCEPT}
          disabled={busy}
          onFiles={addFile}
          title="Drop an image here"
          hint={`One JPEG, PNG, or WebP image up to ${Math.round(FILE_LIMITS.maxImageBytes / (1024 * 1024))} MB.`}
          buttonLabel="Choose an image"
        />
        {issue ? (
          <Notice tone="error" title="This image could not be used">
            {issue}
          </Notice>
        ) : null}
        {file && inputUrl ? (
          <ul className="file-list">
            <li className="file-item">
              <span className="file-item__icon">
                <ImageIcon size={18} aria-hidden="true" />
              </span>
              <span>
                <span className="file-item__name">{file.name}</span>
                <span className="file-item__meta" style={{ display: "block" }}>
                  {formatBytes(file.size)}
                  {original ? ` · ${formatNumber(original.width)}×${formatNumber(original.height)} px` : ""}
                </span>
              </span>
              <span className="file-item__actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={removeFile}
                  disabled={busy}
                  aria-label={`Remove ${file.name}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </span>
            </li>
          </ul>
        ) : null}
      </StepBlock>

      {file && original ? (
        <StepBlock step="Step 02" title="Set target dimensions">
          <div className="form-grid__row">
            <div className="field">
              <label className="field__label" htmlFor="resize-width">
                Width (px)
              </label>
              <input
                id="resize-width"
                className="input"
                type="number"
                inputMode="numeric"
                min={1}
                max={FILE_LIMITS.maxDimension}
                value={widthInput}
                disabled={busy}
                onChange={(event) => updateWidth(event.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="resize-height">
                Height (px)
              </label>
              <input
                id="resize-height"
                className="input"
                type="number"
                inputMode="numeric"
                min={1}
                max={FILE_LIMITS.maxDimension}
                value={heightInput}
                disabled={busy}
                onChange={(event) => updateHeight(event.target.value)}
              />
            </div>
          </div>

          <div className="checkbox-row">
            <input
              id="ratio-lock"
              type="checkbox"
              checked={ratioLocked}
              disabled={busy}
              onChange={(event) => setRatioLocked(event.target.checked)}
            />
            <label htmlFor="ratio-lock">
              Lock aspect ratio ({original.width}:{original.height})
            </label>
          </div>

          <div className="radio-row">
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => applyScale(0.25)} disabled={busy}>
              25%
            </button>
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => applyScale(0.5)} disabled={busy}>
              50%
            </button>
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => applyScale(0.75)} disabled={busy}>
              75%
            </button>
            <button type="button" className="btn btn--secondary btn--sm" onClick={() => applyScale(1)} disabled={busy}>
              Original size
            </button>
          </div>

          <div className="form-grid__row">
            <div className="field">
              <label className="field__label" htmlFor="resize-format">
                Output format
              </label>
              <select
                id="resize-format"
                className="select"
                value={format}
                disabled={busy}
                onChange={(event) => {
                  setFormat(event.target.value as ImageOutputFormat);
                  clearOutput();
                }}
              >
                {(Object.keys(IMAGE_FORMAT_LABELS) as ImageOutputFormat[]).map((option) => (
                  <option key={option} value={option}>
                    {IMAGE_FORMAT_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="resize-quality">
                Quality
                <span className="field__hint">{format === "png" ? "Not used for PNG" : `${quality}%`}</span>
              </label>
              <input
                id="resize-quality"
                className="range-input"
                type="range"
                min={10}
                max={100}
                step={5}
                value={quality}
                disabled={busy || format === "png"}
                onChange={(event) => {
                  setQuality(Number(event.target.value));
                  clearOutput();
                }}
              />
            </div>
          </div>

          {isUpscale ? (
            <Notice tone="warning" title="This output will be upscaled">
              The target is larger than the original image. The result may look softer because upscaling cannot add real
              detail.
            </Notice>
          ) : null}
        </StepBlock>
      ) : null}

      <StepBlock
        step="Step 03"
        title="Resize and download"
        actions={
          <>
            <button
              type="button"
              className="btn btn--accent"
              onClick={resize}
              disabled={!file || !original || busy}
            >
              {status === "working" ? (
                <>
                  <span className="btn__spinner" aria-hidden="true" /> Resizing…
                </>
              ) : (
                <>
                  <Scaling size={16} aria-hidden="true" /> Resize image
                </>
              )}
            </button>
            {output ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => downloadBlob(output.blob, output.fileName)}
              >
                <Download size={16} aria-hidden="true" /> Download resized image
              </button>
            ) : null}
          </>
        }
      >
        {status === "error" && message ? (
          <Notice tone="error" title="The image could not be resized">
            {message}
          </Notice>
        ) : null}
        {status === "done" && message && output ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            <Notice tone="success" title="Resize complete">
              {message} Output size: {formatBytes(output.blob.size)}.
            </Notice>
            <div className="stat-grid">
              <ResultBar label="New width" value={`${formatNumber(output.width)} px`} />
              <ResultBar label="New height" value={`${formatNumber(output.height)} px`} />
              <ResultBar label="File size" value={formatBytes(output.blob.size)} />
              <ResultBar
                label="Scale"
                value={
                  original
                    ? `${Math.round((output.width / original.width) * 100)}%`
                    : "—"
                }
                hint="Relative to original width"
              />
            </div>
            <div className="preview-frame">
              {outputUrl ? <img src={outputUrl} alt="Resized image preview" /> : null}
            </div>
          </div>
        ) : null}
        {!output && status !== "error" ? (
          <p className="muted" style={{ fontSize: "0.87rem" }}>
            The resized image is created on this device. The original file is not changed.
          </p>
        ) : null}
      </StepBlock>
    </Workspace>
  );
}
