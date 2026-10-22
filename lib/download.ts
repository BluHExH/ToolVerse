export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function downloadText(text: string, fileName: string, mimeType = "text/plain;charset=utf-8"): void {
  downloadBlob(new Blob([text], { type: mimeType }), fileName);
}

export function downloadBytes(bytes: Uint8Array, fileName: string, mimeType: string): void {
  const copy = new Uint8Array(bytes);
  downloadBlob(new Blob([copy.buffer as ArrayBuffer], { type: mimeType }), fileName);
}
