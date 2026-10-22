import { FILE_LIMITS } from "./files";

export type ImageOutputFormat = "original" | "jpeg" | "png" | "webp";

export interface ImageDimensions {
  width: number;
  height: number;
}

export const IMAGE_FORMAT_LABELS: Record<ImageOutputFormat, string> = {
  original: "Keep original format",
  jpeg: "JPEG (.jpg)",
  png: "PNG (.png)",
  webp: "WebP (.webp)",
};

export function mimeForFormat(format: Exclude<ImageOutputFormat, "original">): string {
  switch (format) {
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
  }
}

export function extensionForMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "image/png":
    default:
      return "png";
  }
}

export function resolveOutputMime(format: ImageOutputFormat, sourceMime: string): string {
  if (format === "original") {
    if (sourceMime === "image/jpeg" || sourceMime === "image/png" || sourceMime === "image/webp") {
      return sourceMime;
    }
    return "image/png";
  }
  return mimeForFormat(format);
}

export function replaceExtension(fileName: string, extension: string): string {
  const lastDot = fileName.lastIndexOf(".");
  const base = lastDot === -1 ? fileName : fileName.slice(0, lastDot);
  return `${base}.${extension}`;
}

export function withSuffix(fileName: string, suffix: string, extension?: string): string {
  const currentExtension = fileName.split(".").pop() ?? "";
  const nextExtension = extension ?? currentExtension;
  const lastDot = fileName.lastIndexOf(".");
  const base = lastDot === -1 ? fileName : fileName.slice(0, lastDot);
  return `${base}-${suffix}.${nextExtension}`;
}

export function validateDimensions(width: number, height: number): string | null {
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return "Width and height must be numbers.";
  }
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    return "Width and height must be whole numbers of pixels.";
  }
  if (width < 1 || height < 1) {
    return "Width and height must be at least 1 pixel.";
  }
  if (width > FILE_LIMITS.maxDimension || height > FILE_LIMITS.maxDimension) {
    return `The maximum width or height is ${FILE_LIMITS.maxDimension} pixels.`;
  }
  if (width * height > FILE_LIMITS.maxOutputPixels) {
    return "This output would be larger than 40 megapixels. Choose smaller dimensions.";
  }
  return null;
}

export function fitToAspectRatio(
  value: number,
  sourceWidth: number,
  sourceHeight: number,
  axis: "width" | "height",
): number {
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    return Math.max(1, Math.round(value));
  }
  const ratio = sourceWidth / sourceHeight;
  const computed = axis === "width" ? value / ratio : value * ratio;
  if (!Number.isFinite(computed)) {
    return Math.max(1, Math.round(value));
  }
  return Math.max(1, Math.round(computed));
}

export function sizeReductionPercent(originalBytes: number, outputBytes: number): number {
  if (originalBytes <= 0 || outputBytes <= 0) {
    return 0;
  }
  return ((originalBytes - outputBytes) / originalBytes) * 100;
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The browser could not decode this image."));
    image.src = url;
  });
}

export function loadImageFromFile(file: File): Promise<{ image: HTMLImageElement; revoke: () => void }> {
  const url = URL.createObjectURL(file);
  return loadImageFromUrl(url)
    .then((image) => ({ image, revoke: () => URL.revokeObjectURL(url) }))
    .catch((error: unknown) => {
      URL.revokeObjectURL(url);
      throw error;
    });
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("The browser could not create an image with these settings."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

export async function canvasSupportsMime(mimeType: string): Promise<boolean> {
  const canvas = createCanvas(1, 1);
  try {
    const blob = await canvasToBlob(canvas, mimeType, 0.9);
    return blob.type === mimeType;
  } catch {
    return false;
  }
}

export function drawToCanvas(
  image: CanvasImageSource,
  width: number,
  height: number,
  background?: string,
): HTMLCanvasElement {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("The browser did not provide a 2D canvas context.");
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  if (background) {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(image, 0, 0, width, height);
  return canvas;
}
