import type { ReactNode } from "react";

export function Workspace({
  title,
  icon,
  actions,
  footer,
  children,
}: {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="workspace" aria-label={title}>
      <div className="workspace__top">
        <h2 className="workspace__title">
          {icon}
          {title}
        </h2>
        {actions ? <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>{actions}</div> : null}
      </div>
      <div className="workspace__body">{children}</div>
      {footer ? <div className="workspace__footer">{footer}</div> : null}
    </section>
  );
}

export function StepBlock({
  step,
  title,
  children,
  actions,
}: {
  step: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="step-block">
      <div className="step-block__head">
        <span className="step-block__num" aria-hidden="true">
          {step}
        </span>
        <h3 className="step-block__title">{title}</h3>
      </div>
      {children}
      {actions ? <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>{actions}</div> : null}
    </div>
  );
}

export function ToolLoading() {
  return (
    <div className="workspace">
      <div className="workspace__top">
        <h2 className="workspace__title">Loading tool…</h2>
      </div>
      <div className="workspace__body">
        <div
          aria-hidden="true"
          style={{ height: "8rem", borderRadius: "10px", background: "var(--paper-deep)" }}
        />
        <p className="muted" role="status">
          Preparing the browser tools on this device.
        </p>
      </div>
    </div>
  );
}

export function ResultBar({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="stat">
      <p className="stat__value">{value}</p>
      <p className="stat__label">{label}</p>
      {hint ? <p className="muted" style={{ fontSize: "0.78rem", marginTop: "0.25rem" }}>{hint}</p> : null}
    </div>
  );
}
