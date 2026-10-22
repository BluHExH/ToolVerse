"use client";

import { useId } from "react";
import type { JsonParseError } from "@/lib/json";

export function JsonTextArea({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  invalid = false,
  hint,
  rows = 12,
  onKeyDown,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  invalid?: boolean;
  hint?: string;
  rows?: number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  const id = useId();
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {hint ? <span className="field__hint">{hint}</span> : null}
      </label>
      <textarea
        id={id}
        className="textarea code-area"
        style={{ minHeight: `${rows * 1.55}rem` }}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        aria-invalid={invalid || undefined}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

export function JsonErrorDetails({ error }: { error: JsonParseError }) {
  return (
    <div className="error-details">
      <p>{error.message}</p>
      {error.line !== null && error.column !== null ? (
        <>
          <p className="error-details__location">
            Line {error.line}, column {error.column}
            {error.position !== null ? ` · character ${error.position}` : ""}
          </p>
          {error.lineText !== null ? (
            <pre className="error-details__line">
              {error.lineText.length > 200 ? `${error.lineText.slice(0, 200)}…` : error.lineText}
              {"\n"}
              {`${" ".repeat(Math.max(0, Math.min(error.column - 1, 200)))}^`}
            </pre>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
