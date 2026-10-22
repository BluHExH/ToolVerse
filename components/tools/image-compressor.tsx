"use client";

import { useEffect, useState } from "react";
import { Download, Image as ImageIcon, Minimize2, Trash2 } from "lucide-react";
import { FILE_LIMITS, IMAGE_ACCEPT, validateImageFile } from "@/lib/files";
import { downloadBlob } from "@/lib/download";
import { formatBytes, formatNumber } from "@/lib/format";
import {
  IMAGE_FORMAT_LABELS,
  canvasSupportsMime,
  canvasToBlob,
  drawToCanvas,
  extensionForMime,
  loadImageFromFile,
  resolveOutputMime,
  sizeReductionPercent,
  withSuffix,
  type ImageOutputFormat,
} from "@/lib/image";
import { useObjectUrl } from "@/hooks/use-object-url";
import { Notice } from "@/components/notice";
import { FilePicker } from "./file-picker";
import { ResultBar, StepBlock, Workspace } from "./workspace";

interface CompressedOutput {
  blob: Blob;
  mimeType: string;
  width: number;
  height: number;
  fileName: string;
}

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [format, setFormat] = useState<ImageOutputFormat>("webp");
  const [quality, setQuality] = useState(75);
  const [issue, setIssue] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [output, setOutput] = useState<CompressedOutput | null>(null);

  const inputUrl = useObjectUrl(file);
  const outputUrl = useObjectUrl(output?.blob ?? null);
  const busy = status === "loading" || status === "working";

  useEffect(() => {
    if (!file) {
      setDimensions(null);
      return;
    }
    let revoke: (() => void) | null = null;
    let cancelled = false;
    loadImageFromFile(file)
      .then(({ image, revoke: revokeUrl }) => {
        revoke = revokeUrl;
        if (!cancelled) {
          setDimensions({ width: image.naturalWidth, height: image.naturalHeight });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIssue("The browser could not decode this image. Try a JPEG, PNG, or WebP file.");
          setFile(null);
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
    setStatus("idle");
    if (!validationError) {
      setFile(candidate);
    }
  };

  const removeFile = () => {
    setFile(null);
    setIssue(null);
    clearOutput();
  };

  const compress = async () => {
    if (!file) return;
    setStatus("working");
    setMessage(null);
    setOutput(null);

    try {
      const mimeType = resolveOutputMime(format, file.type);
      if (mimeType === "image/webp" && !(await canvasSupportsMime("image/webp"))) {
        setStatus("error");
        setMessage("This browser cannot encode WebP images. Choose JPEG or keep the original format.");
        return;
      }

      const { image, revoke } = await loadImageFromFile(file);
      try {
        const useQuality = mimeType === "image/jpeg" || mimeType === "image/webp";
        const canvas = drawToCanvas(
          image,
          image.naturalWidth,
          image.naturalHeight,
          mimeType === "image/jpeg" ? "#ffffff" : undefined,
        );
        const blob = await canvasToBlob(canvas, mimeType, useQuality ? quality / 100 : undefined);
        setOutput({
          blob,
          mimeType,
          width: canvas.width,
          height: canvas.height,
          fileName: withSuffix(file.name, "compressed", extensionForMime(mimeType)),
        });
        setStatus("done");
        setMessage("Compression complete.");
      } finally {
        revoke();
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The image could not be compressed.");
    }
  };

  const reduction = output && file ? sizeReductionPercent(file.size, output.blob.size) : null;
  const isLossy = output ? output.mimeType === "image/jpeg" || output.mimeType === "image/webp" : false;

  return (
    <Workspace
      title="Compress an image"
      icon={<Minimize2 size={16} aria-hidden="true" />}
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
            {file
              ? `${file.name} · ${formatBytes(file.size)}${dimensions ? ` · ${dimensions.width}×${dimensions.height}` : ""}`
              : `One image up to ${Math.round(FILE_LIMITS.maxImageBytes / (1024 * 1024))} MB`}
          </span>
          <span className="workspace__footer-note" role="status" aria-live="polite">
            {status === "working" ? "Compressing…" : null}
          </span>
        </>
      }
    >
      <StepBlock step="Step 01" title="Add a JPEG, PNG, or WebP">
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
                  {file.type || "image"} · {formatBytes(file.size)}
                  {dimensions ? ` · ${formatNumber(dimensions.width)}×${formatNumber(dimensions.height)} px` : ""}
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

      {file ? (
        <StepBlock step="Step 02" title="Choose output settings">
          <div className="form-grid__row">
            <div className="field">
              <label className="field__label" htmlFor="compression-format">
                Output format
              </label>
              <select
                id="compression-format"
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
              <label className="field__label" htmlFor="compression-quality">
                Quality
                <span className="field__hint">{format === "png" ? "Not used for PNG" : `${quality}%`}</span>
              </label>
              <input
                id="compression-quality"
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
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            JPEG and WebP compression is lossy: a lower quality produces a smaller file with less detail. Converting to
            PNG is lossless but does not restore detail that was already lost.
          </p>
        </StepBlock>
      ) : null}

      <StepBlock
        step="Step 03"
        title="Compress and compare"
        actions={
          <>
            <button type="button" className="btn btn--accent" onClick={compress} disabled={!file || busy}>
              {status === "working" ? (
                <>
                  <span className="btn__spinner" aria-hidden="true" /> Compressing…
                </>
              ) : (
                <>
                  <Minimize2 size={16} aria-hidden="true" /> Compress image
                </>
              )}
            </button>
            {output ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => downloadBlob(output.blob, output.fileName)}
              >
                <Download size={16} aria-hidden="true" /> Download compressed image
              </button>
            ) : null}
          </>
        }
      >
        {status === "error" && message ? (
          <Notice tone="error" title="The image could not be compressed">
            {message}
          </Notice>
        ) : null}

        {output ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            <Notice
              tone={reduction !== null && reduction < 0 ? "warning" : "success"}
              title={reduction !== null && reduction < 0 ? "The output is larger than the original" : "Compression complete"}
            >
              {reduction !== null && reduction >= 0
                ? `Reduced by ${Math.round(reduction)}% — from ${formatBytes(file?.size ?? 0)} to ${formatBytes(
                    output.blob.size,
                  )}.`
                : `The re-encoded file is ${formatBytes(output.blob.size)} compared with ${formatBytes(
                    file?.size ?? 0,
                  )}. Try a lower quality, WebP output, or keep the original file.`}
              {isLossy ? " The output was re-encoded with lossy compression." : " PNG output keeps full quality."}
            </Notice>

            <div className="stat-grid">
              <ResultBar label="Original size" value={formatBytes(file?.size ?? 0)} />
              <ResultBar label="New size" value={formatBytes(output.blob.size)} />
              <ResultBar
                label="Change"
                value={reduction === null ? "—" : `${reduction >= 0 ? "−" : "+"}${Math.abs(Math.round(reduction))}%`}
                hint={reduction !== null && reduction < 0 ? "Larger than original" : undefined}
              />
              <ResultBar
                label="Dimensions"
                value={`${formatNumber(output.width)}×${formatNumber(output.height)}`}
                hint="Pixels"
              />
            </div>

            <div className="compare-grid">
              <div>
                <p className="field__label" style={{ marginBottom: "0.4rem" }}>
                  Original
                </p>
                <div className="preview-frame">
                  {inputUrl ? <img src={inputUrl} alt={`Original preview of ${file?.name ?? "image"}`} /> : null}
                </div>
              </div>
              <div>
                <p className="field__label" style={{ marginBottom: "0.4rem" }}>
                  Compressed
                </p>
                <div className="preview-frame">
                  {outputUrl ? <img src={outputUrl} alt="Compressed image preview" /> : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="muted" style={{ fontSize: "0.87rem" }}>
            The compressed image is created on this device. Nothing is uploaded, and the original file is not changed.
          </p>
        )}
      </StepBlock>
    </Workspace>
  );
}
