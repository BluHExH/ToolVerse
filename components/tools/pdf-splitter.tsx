"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Scissors, Trash2 } from "lucide-react";
import { FILE_LIMITS, PDF_ACCEPT, fileBaseName, hasPdfSignature, validatePdfFile } from "@/lib/files";
import { downloadBytes } from "@/lib/download";
import { formatBytes, formatNumber } from "@/lib/format";
import {
  formatPageSelection,
  parsePageSelection,
  selectEvenPages,
  selectOddPages,
} from "@/lib/page-range";
import { describePdfLoadError, extractPdfPages, readPdfInfo } from "@/lib/pdf";
import { Notice } from "@/components/notice";
import { FilePicker } from "./file-picker";
import { StepBlock, Workspace } from "./workspace";

interface SplitFile {
  file: File;
  pageCount: number;
}

interface SplitOutput {
  bytes: Uint8Array;
  pages: number[];
  fileName: string;
}

export default function PdfSplitter() {
  const [source, setSource] = useState<SplitFile | null>(null);
  const [rangeInput, setRangeInput] = useState("");
  const [issue, setIssue] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [status, setStatus] = useState<"idle" | "splitting" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [output, setOutput] = useState<SplitOutput | null>(null);

  const parsed = useMemo(() => {
    if (!source) {
      return null;
    }
    return parsePageSelection(rangeInput, source.pageCount);
  }, [rangeInput, source]);

  const busy = isReading || status === "splitting";
  const selectionError = parsed && !parsed.ok ? parsed.error : null;
  const selectedPages = parsed && parsed.ok ? parsed.pages : [];

  const clearOutput = () => {
    setOutput(null);
    setMessage(null);
    if (status === "done" || status === "error") {
      setStatus("idle");
    }
  };

  const addFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setIssue(null);
    setMessage(null);
    setOutput(null);
    setStatus("idle");

    const validationError = validatePdfFile(file);
    if (validationError) {
      setIssue(validationError);
      return;
    }

    setIsReading(true);
    try {
      const hasSignature = await hasPdfSignature(file);
      if (!hasSignature) {
        setIssue("This file does not start with a PDF header, so it cannot be split.");
        setIsReading(false);
        return;
      }
      const info = await readPdfInfo(file);
      setSource({ file, pageCount: info.pageCount });
      setRangeInput(info.pageCount > 1 ? `1-${info.pageCount}` : "1");
    } catch (error) {
      setIssue(describePdfLoadError(error));
    } finally {
      setIsReading(false);
    }
  };

  const removeFile = () => {
    setSource(null);
    setRangeInput("");
    setIssue(null);
    clearOutput();
  };

  const split = async () => {
    if (!source || !parsed || !parsed.ok) {
      setStatus("error");
      setMessage(selectionError ?? "Choose a file and a valid page selection first.");
      return;
    }
    setStatus("splitting");
    setMessage(null);
    setOutput(null);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 30));
      const bytes = await extractPdfPages(source.file, parsed.pages);
      setOutput({
        bytes,
        pages: parsed.pages,
        fileName: `${fileBaseName(source.file.name)}-pages-${parsed.pages.length === 1 ? parsed.pages[0] : "selected"}.pdf`,
      });
      setStatus("done");
      setMessage(
        `Extracted ${formatNumber(parsed.pages.length)} page${
          parsed.pages.length === 1 ? "" : "s"
        } (${formatBytes(bytes.byteLength)}).`,
      );
    } catch (error) {
      setStatus("error");
      setMessage(describePdfLoadError(error));
    }
  };

  const quickSelect = (pages: number[]) => {
    setRangeInput(formatPageSelection(pages));
    clearOutput();
  };

  return (
    <Workspace
      title="Split a PDF"
      icon={<Scissors size={16} aria-hidden="true" />}
      actions={
        source ? (
          <button type="button" className="btn btn--quiet btn--sm" onClick={removeFile} disabled={busy}>
            Remove file
          </button>
        ) : null
      }
      footer={
        <>
          <span className="workspace__footer-note">
            {source
              ? `${source.file.name} · ${formatNumber(source.pageCount)} pages · ${formatBytes(source.file.size)}`
              : `One PDF up to ${Math.round(FILE_LIMITS.maxPdfBytes / (1024 * 1024))} MB`}
          </span>
          <span className="workspace__footer-note" role="status" aria-live="polite">
            {isReading ? "Reading PDF…" : null}
            {status === "splitting" ? "Extracting pages…" : null}
            {selectedPages.length > 0 ? `${formatNumber(selectedPages.length)} selected` : null}
          </span>
        </>
      }
    >
      <StepBlock step="Step 01" title="Add one PDF">
        <FilePicker
          accept={PDF_ACCEPT}
          disabled={busy}
          onFiles={addFile}
          title="Drop a PDF here"
          hint={`One PDF up to ${Math.round(FILE_LIMITS.maxPdfBytes / (1024 * 1024))} MB.`}
          buttonLabel="Choose a PDF"
        />
        {issue ? (
          <Notice tone="error" title="This file could not be used">
            {issue}
          </Notice>
        ) : null}
        {source ? (
          <ul className="file-list">
            <li className="file-item">
              <span className="file-item__icon">
                <FileText size={18} aria-hidden="true" />
              </span>
              <span>
                <span className="file-item__name">{source.file.name}</span>
                <span className="file-item__meta" style={{ display: "block" }}>
                  {formatNumber(source.pageCount)} page{source.pageCount === 1 ? "" : "s"} ·{" "}
                  {formatBytes(source.file.size)}
                </span>
              </span>
              <span className="file-item__actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={removeFile}
                  disabled={busy}
                  aria-label={`Remove ${source.file.name}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </span>
            </li>
          </ul>
        ) : null}
      </StepBlock>

      {source ? (
        <StepBlock step="Step 02" title="Choose pages">
          <div className="field">
            <label className="field__label" htmlFor="page-selection">
              Pages or ranges
              <span className="field__hint">Example: 1-3, 7, 10-12</span>
            </label>
            <input
              id="page-selection"
              className="input mono"
              type="text"
              value={rangeInput}
              placeholder="e.g. 1-3, 7"
              disabled={busy}
              aria-invalid={selectionError ? "true" : undefined}
              aria-describedby={selectionError ? "page-selection-error" : undefined}
              onChange={(event) => {
                setRangeInput(event.target.value);
                clearOutput();
              }}
            />
            {selectionError ? (
              <p className="field-error" id="page-selection-error">
                {selectionError}
              </p>
            ) : (
              <p className="field__hint">
                {parsed && parsed.ok
                  ? `${formatNumber(parsed.pages.length)} page${
                      parsed.pages.length === 1 ? "" : "s"
                    } selected: ${parsed.label}`
                  : "Enter at least one page or range."}
              </p>
            )}
          </div>

          <div className="radio-row">
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => quickSelect(Array.from({ length: source.pageCount }, (_, index) => index + 1))}
              disabled={busy}
            >
              All pages
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => quickSelect([1])}
              disabled={busy}
            >
              First page
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => quickSelect([source.pageCount])}
              disabled={busy}
            >
              Last page
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => quickSelect(selectOddPages(source.pageCount))}
              disabled={busy}
            >
              Odd pages
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => quickSelect(selectEvenPages(source.pageCount))}
              disabled={busy}
            >
              Even pages
            </button>
          </div>
        </StepBlock>
      ) : null}

      <StepBlock
        step="Step 03"
        title="Extract and download"
        actions={
          <>
            <button
              type="button"
              className="btn btn--accent"
              onClick={split}
              disabled={!source || !parsed?.ok || busy}
            >
              {status === "splitting" ? (
                <>
                  <span className="btn__spinner" aria-hidden="true" /> Extracting…
                </>
              ) : (
                <>
                  <Scissors size={16} aria-hidden="true" /> Split PDF
                </>
              )}
            </button>
            {output ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => downloadBytes(output.bytes, output.fileName, "application/pdf")}
              >
                <Download size={16} aria-hidden="true" /> Download new PDF
              </button>
            ) : null}
          </>
        }
      >
        {status === "done" && message ? (
          <Notice tone="success" title="Your pages are ready">
            {message}
            {output ? ` Pages: ${formatPageSelection(output.pages)}.` : null}
          </Notice>
        ) : null}
        {status === "error" && message ? (
          <Notice tone="error" title="The PDF could not be split">
            {message}
          </Notice>
        ) : null}
        {!output && status !== "error" ? (
          <p className="muted" style={{ fontSize: "0.87rem" }}>
            Selected pages are copied into a new document in document order. The original file is left unchanged.
          </p>
        ) : null}
      </StepBlock>
    </Workspace>
  );
}
