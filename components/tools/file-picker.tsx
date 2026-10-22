"use client";

import { useId, useRef, useState } from "react";
import { Upload } from "lucide-react";

export function FilePicker({
  accept,
  multiple = false,
  onFiles,
  disabled = false,
  title,
  hint,
  buttonLabel,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  title: string;
  hint: string;
  buttonLabel: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }
    onFiles(Array.from(fileList));
  };

  return (
    <div
      className="dropzone"
      data-dragging={dragging}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (disabled) return;
        handleFiles(event.dataTransfer.files);
      }}
    >
      <span className="dropzone__icon">
        <Upload size={20} aria-hidden="true" />
      </span>
      <p className="dropzone__title">{title}</p>
      <p className="dropzone__hint" id={`${inputId}-hint`}>
        {hint}
      </p>
      <div className="dropzone__actions">
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {buttonLabel}
        </button>
      </div>
      <input
        ref={inputRef}
        id={inputId}
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        tabIndex={-1}
        disabled={disabled}
        aria-describedby={`${inputId}-hint`}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
