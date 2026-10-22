"use client";

import { useEffect, useState } from "react";
import { Download, FileImage, Image as ImageIcon, Trash2 } from "lucide-react";
import { FILE_LIMITS, JPEG_ACCEPT, validateImageFile } from "@/lib/files";
import { downloadBlob } from "@/lib/download";
import { formatBytes, formatNumber } from "@/lib/format";
import { canvasToBlob, drawToCanvas, loadImageFromFile, replaceExtension } from "@/lib/image";
import { useObjectUrl } from "@/hooks/use-object-url";
import { Notice } from "@/components/notice";
import { FilePicker } from "./file-picker";
import { ResultBar, StepBlock, Workspace } from "./workspace";

interface PngOutput {
  blob: Blob;
  width: number;
  height: number;
  fileName: string;
}

export default function JpgToPng() {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [issue, setIssue] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [output, setOutput] = useState<PngOutput | null>(null);

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
          setIssue("The browser could not decode this JPEG.");
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
    const validationError = validateImageFile(candidate, { jpegOnly: true });
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
    setDimensions(null);
    clearOutput();
  };

  const convert = async () => {
    if (!file) return;
    setStatus("working");
    setMessage(null);
    setOutput(null);
    try {
      const { image, revoke } = await loadImageFromFile(file);
      try {
        const canvas = drawToCanvas(image, image.naturalWidth, image.naturalHeight);
        const blob = await canvasToBlob(canvas, "image/png");
        setOutput({
          blob,
          width: canvas.width,
          height: canvas.height,
          fileName: replaceExtension(file.name, "png"),
        });
        setStatus("done");
        setMessage("Converted to PNG.");
      } finally {
        revoke();
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The image could not be converted.");
    }
  };

  return (
    <Workspace
      title="Convert JPG to PNG"
      icon={<FileImage size={16} aria-hidden="true" />}
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
              ? `${file.name} · ${formatBytes(file.size)}${
                  dimensions ? ` · ${formatNumber(dimensions.width)}×${formatNumber(dimensions.height)} px` : ""
                }`
              : `One JPEG up to ${Math.round(FILE_LIMITS.maxImageBytes / (1024 * 1024))} MB`}
          </span>
          <span className="workspace__footer-note" role="status" aria-live="polite">
            {status === "working" ? "Converting…" : null}
          </span>
        </>
      }
    >
      <StepBlock step="Step 01" title="Add a JPEG image">
        <FilePicker
          accept={JPEG_ACCEPT}
          disabled={busy}
          onFiles={addFile}
          title="Drop a .jpg or .jpeg file here"
          hint={`One JPEG image up to ${Math.round(FILE_LIMITS.maxImageBytes / (1024 * 1024))} MB.`}
          buttonLabel="Choose a JPEG"
        />
        {issue ? (
          <Notice tone="error" title="This file could not be used">
            {issue}
          </Notice>
        ) : null}
        {file && inputUrl ? (
          <>
            <ul className="file-list">
              <li className="file-item">
                <span className="file-item__icon">
                  <ImageIcon size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="file-item__name">{file.name}</span>
                  <span className="file-item__meta" style={{ display: "block" }}>
                    {formatBytes(file.size)}
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
            <div className="preview-frame">
              <img src={inputUrl} alt={`JPEG preview of ${file.name}`} />
            </div>
          </>
        ) : null}
      </StepBlock>

      <StepBlock
        step="Step 02"
        title="Convert and download"
        actions={
          <>
            <button type="button" className="btn btn--accent" onClick={convert} disabled={!file || busy}>
              {status === "working" ? (
                <>
                  <span className="btn__spinner" aria-hidden="true" /> Converting…
                </>
              ) : (
                <>
                  <FileImage size={16} aria-hidden="true" /> Convert to PNG
                </>
              )}
            </button>
            {output ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => downloadBlob(output.blob, output.fileName)}
              >
                <Download size={16} aria-hidden="true" /> Download PNG
              </button>
            ) : null}
          </>
        }
      >
        <Notice tone="info" title="A note about quality">
          Converting a JPEG to PNG changes the file format, not the image data. Detail already lost to JPEG compression
          is not restored, and the PNG will often be larger than the original.
        </Notice>

        {status === "error" && message ? (
          <Notice tone="error" title="The conversion failed">
            {message}
          </Notice>
        ) : null}

        {status === "done" && output ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            <Notice tone="success" title="PNG created">
              {message} Output size: {formatBytes(output.blob.size)}.
            </Notice>
            <div className="stat-grid">
              <ResultBar label="Original size" value={formatBytes(file?.size ?? 0)} />
              <ResultBar label="PNG size" value={formatBytes(output.blob.size)} />
              <ResultBar
                label="Dimensions"
                value={`${formatNumber(output.width)}×${formatNumber(output.height)}`}
                hint="Pixels"
              />
              <ResultBar label="Format" value="PNG" hint="Lossless container" />
            </div>
            <div className="preview-frame">
              {outputUrl ? <img src={outputUrl} alt="PNG output preview" /> : null}
            </div>
          </div>
        ) : null}
      </StepBlock>
    </Workspace>
  );
}
