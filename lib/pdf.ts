export interface PdfFileInfo {
  name: string;
  size: number;
  pageCount: number;
}

export async function readPdfInfo(file: File): Promise<PdfFileInfo> {
  const { PDFDocument } = await import("pdf-lib");
  const bytes = await file.arrayBuffer();
  const document = await PDFDocument.load(bytes, { updateMetadata: false });
  return {
    name: file.name,
    size: file.size,
    pageCount: document.getPageCount(),
  };
}

export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const merged = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const source = await PDFDocument.load(bytes, { updateMetadata: false });
    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) {
      merged.addPage(page);
    }
  }

  const mergedBytes = await merged.save();
  return mergedBytes;
}

export async function extractPdfPages(file: File, pages: number[]): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const bytes = await file.arrayBuffer();
  const source = await PDFDocument.load(bytes, { updateMetadata: false });
  const output = await PDFDocument.create();
  const copied = await output.copyPages(
    source,
    pages.map((page) => page - 1),
  );
  for (const page of copied) {
    output.addPage(page);
  }
  return output.save();
}

export function describePdfLoadError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/encrypted|password/i.test(message)) {
    return "This PDF is password-protected. Remove the password and try again.";
  }
  if (/invalid pdf|failed to parse|no pdf header/i.test(message)) {
    return "This file is not a valid PDF or it is damaged.";
  }
  return "This PDF could not be read. The file may be damaged or use an unsupported feature.";
}
