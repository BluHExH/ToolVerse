export const FILE_LIMITS = {
  maxPdfBytes: 50 * 1024 * 1024,
  maxImageBytes: 25 * 1024 * 1024,
  maxPdfFiles: 20,
  maxOutputPixels: 40_000_000,
  maxDimension: 10_000,
} as const;

export const PDF_ACCEPT = ".pdf,application/pdf";
export const IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
export const JPEG_ACCEPT = ".jpg,.jpeg,image/jpeg";

export const PDF_MIME_TYPES = new Set(["application/pdf"]);
export const IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export const JPEG_MIME_TYPES = new Set(["image/jpeg"]);

export interface FileIssue {
  fileName: string;
  message: string;
}

export function getExtension(fileName: string): string {
  const index = fileName.lastIndexOf(".");
  return index === -1 ? "" : fileName.slice(index + 1).toLowerCase();
}

export function fileBaseName(fileName: string): string {
  const index = fileName.lastIndexOf(".");
  return index === -1 ? fileName : fileName.slice(0, index);
}

export function isPdfFile(file: File): boolean {
  return PDF_MIME_TYPES.has(file.type) || getExtension(file.name) === "pdf";
}

export function isImageFile(file: File): boolean {
  return IMAGE_MIME_TYPES.has(file.type) || ["jpg", "jpeg", "png", "webp"].includes(getExtension(file.name));
}

export function isJpegFile(file: File): boolean {
  return JPEG_MIME_TYPES.has(file.type) || ["jpg", "jpeg"].includes(getExtension(file.name));
}

export function validatePdfFile(file: File, maxBytes = FILE_LIMITS.maxPdfBytes): string | null {
  if (!isPdfFile(file)) {
    return "This is not a PDF file. Choose a file ending in .pdf.";
  }
  if (file.size === 0) {
    return "This file is empty.";
  }
  if (file.size > maxBytes) {
    return `This file is larger than the ${Math.round(maxBytes / (1024 * 1024))} MB limit.`;
  }
  return null;
}

export function validateImageFile(
  file: File,
  options: { jpegOnly?: boolean; maxBytes?: number } = {},
): string | null {
  const { jpegOnly = false, maxBytes = FILE_LIMITS.maxImageBytes } = options;
  const validType = jpegOnly ? isJpegFile(file) : isImageFile(file);

  if (!validType) {
    return jpegOnly
      ? "This is not a JPEG image. Choose a file ending in .jpg or .jpeg."
      : "Use a JPEG, PNG, or WebP image.";
  }
  if (file.size === 0) {
    return "This file is empty.";
  }
  if (file.size > maxBytes) {
    return `This image is larger than the ${Math.round(maxBytes / (1024 * 1024))} MB limit.`;
  }
  return null;
}

export async function hasPdfSignature(file: File): Promise<boolean> {
  if (file.size < 5) {
    return false;
  }
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  return header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46;
}

export function createId(prefix = "item"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
