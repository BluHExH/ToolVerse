"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Download, FileText, Merge, Trash2 } from "lucide-react";
import { FILE_LIMITS, PDF_ACCEPT, createId, hasPdfSignature, validatePdfFile } from "@/lib/files";
import { downloadBytes } from "@/lib/download";
import { formatBytes, formatNumber } from "@/lib/format";
import { describePdfLoadError, mergePdfFiles, readPdfInfo } from "@/lib/pdf";
import { Notice } from "@/components/notice";
import { FilePicker } from "./file-picker";
import { StepBlock, Workspace } from "./workspace";

interface MergeEntry {
  id: string;
  file: File;
  pageCount: number;
}

interface MergeOutput {
  bytes: Uint8Array;
  pageCount: number;
}

export default function PdfMerger() {
  const [entries, setEntries] = useState<MergeEntry[]>([]);
  const [issues, setIssues] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "reading" | "merging" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [output, setOutput] = useState<MergeOutput | null>(null);

  const totalBytes = useMemo(() => entries.reduce((sum, entry) => sum + entry.file.size, 0), [entries]);
  const totalPages = useMemo(() => entries.reduce((sum, entry) => sum + entry.pageCount, 0), [entries]);
  const busy = status === "reading" || status === "merging";

  const resetOutput = () => {
    setOutput(null);
    setMessage(null);
    if (status === "done" || status === "error") {
      setStatus("idle");
    }
  };

  const addFiles = async (files: File[]) => {
    const nextIssues: string[] = [];
    const additions: MergeEntry[] = [];
    const remainingSlots = FILE_LIMITS.maxPdfFiles - entries.length;

    if (remainingSlots <= 0) {
      setIssues([`The merger accepts up to ${FILE_LIMITS.maxPdfFiles} files. Remove a file before adding more.`]);
      return;
    }

    const accepted = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      nextIssues.push(
        `Only ${remainingSlots} more file${remainingSlots === 1 ? "" : "s"} could be added. The limit is ${
          FILE_LIMITS.maxPdfFiles
        }.`,
      );
    }

    setStatus("reading");
    setIssues(nextIssues);

    for (const file of accepted) {
      const validationError = validatePdfFile(file);
      if (validationError) {
        nextIssues.push(`${file.name}: ${validationError}`);
        continue;
      }
      try {
        const hasSignature = await hasPdfSignature(file);
        if (!hasSignature) {
          nextIssues.push(`${file.name}: This file does not start with a PDF header, so it cannot be merged.`);
          continue;
        }
        const info = await readPdfInfo(file);
        additions.push({ id: createId("pdf"), file, pageCount: info.pageCount });
      } catch (error) {
        nextIssues.push(`${file.name}: ${describePdfLoadError(error)}`);
      }
    }

    if (additions.length > 0) {
      setEntries((current) => [...current, ...additions]);
      resetOutput();
    }
    setIssues(nextIssues);
    setStatus("idle");
  };

  const move = (index: number, direction: -1 | 1) => {
    setEntries((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) {
        return current;
      }
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    resetOutput();
  };

  const remove = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    resetOutput();
  };

  const clearAll = () => {
    setEntries([]);
    setIssues([]);
    setOutput(null);
    setMessage(null);
    setStatus("idle");
  };

  const merge = async () => {
    if (entries.length < 2) {
      setStatus("error");
      setMessage("Add at least two PDF files to merge.");
      return;
    }
    setStatus("merging");
    setMessage(null);
    setIssues([]);
    setOutput(null);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 30));
      const bytes = await mergePdfFiles(entries.map((entry) => entry.file));
      setOutput({ bytes, pageCount: totalPages });
      setStatus("done");
      setMessage(
        `Merged ${entries.length} files into a ${formatNumber(totalPages)}-page PDF (${formatBytes(bytes.byteLength)}).`,
      );
    } catch (error) {
      setStatus("error");
      setMessage(describePdfLoadError(error));
    }
  };

  return (
    <Workspace
      title="Merge PDF files"
      icon={<Merge size={16} aria-hidden="true" />}
      actions={
        entries.length > 0 ? (
          <button type="button" className="btn btn--quiet btn--sm" onClick={clearAll} disabled={busy}>
            Start over
          </button>
        ) : null
      }
      footer={
        <>
          <span className="workspace__footer-note">
            {entries.length} file{entries.length === 1 ? "" : "s"} · {formatNumber(totalPages)} pages ·{" "}
            {formatBytes(totalBytes)}
          </span>
          <span className="workspace__footer-note" role="status" aria-live="polite">
            {status === "reading" ? "Reading files…" : null}
            {status === "merging" ? "Merging…" : null}
          </span>
        </>
      }
    >
      <StepBlock step="Step 01" title="Add PDF files">
        <FilePicker
          accept={PDF_ACCEPT}
          multiple
          disabled={busy}
          onFiles={addFiles}
          title="Drop PDF files here"
          hint={`Two or more PDFs, up to ${FILE_LIMITS.maxPdfFiles} files and ${Math.round(
            FILE_LIMITS.maxPdfBytes / (1024 * 1024),
          )} MB each.`}
          buttonLabel="Choose PDF files"
        />
        {issues.length > 0 ? (
          <Notice tone="error" title="Some files were not added">
            <ul style={{ display: "grid", gap: "0.3rem" }}>
              {issues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </Notice>
        ) : null}
      </StepBlock>

      {entries.length > 0 ? (
        <StepBlock step="Step 02" title="Arrange the order">
          <ul className="file-list">
            {entries.map((entry, index) => (
              <li className="file-item" key={entry.id}>
                <span className="file-item__icon">
                  <FileText size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="file-item__name">{entry.file.name}</span>
                  <span className="file-item__meta" style={{ display: "block" }}>
                    Position {index + 1} · {formatNumber(entry.pageCount)} page
                    {entry.pageCount === 1 ? "" : "s"} · {formatBytes(entry.file.size)}
                  </span>
                </span>
                <span className="file-item__actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => move(index, -1)}
                    disabled={index === 0 || busy}
                    aria-label={`Move ${entry.file.name} up`}
                  >
                    <ArrowUp size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => move(index, 1)}
                    disabled={index === entries.length - 1 || busy}
                    aria-label={`Move ${entry.file.name} down`}
                  >
                    <ArrowDown size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => remove(entry.id)}
                    disabled={busy}
                    aria-label={`Remove ${entry.file.name}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </StepBlock>
      ) : null}

      <StepBlock
        step="Step 03"
        title="Merge and download"
        actions={
          <>
            <button
              type="button"
              className="btn btn--accent"
              onClick={merge}
              disabled={entries.length < 2 || busy}
            >
              {status === "merging" ? (
                <>
                  <span className="btn__spinner" aria-hidden="true" /> Merging…
                </>
              ) : (
                <>
                  <Merge size={16} aria-hidden="true" /> Merge PDFs
                </>
              )}
            </button>
            {output ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => downloadBytes(output.bytes, "toolverse-merged.pdf", "application/pdf")}
              >
                <Download size={16} aria-hidden="true" /> Download merged PDF
              </button>
            ) : null}
          </>
        }
      >
        {status === "done" && message ? (
          <Notice tone="success" title="Your merged PDF is ready">
            {message}
          </Notice>
        ) : null}
        {status === "error" && message ? (
          <Notice tone="error" title="The files could not be merged">
            {message}
          </Notice>
        ) : null}
        {!output && status !== "error" ? (
          <p className="muted" style={{ fontSize: "0.87rem" }}>
            Nothing is uploaded. Each file is read and combined locally when you select Merge PDFs.
          </p>
        ) : null}
      </StepBlock>
    </Workspace>
  );
}
