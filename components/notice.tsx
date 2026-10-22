import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

export type NoticeTone = "info" | "success" | "warning" | "error";

const icons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
} as const;

const titles: Record<NoticeTone, string> = {
  info: "Note",
  success: "Done",
  warning: "Check this",
  error: "Something went wrong",
};

export function Notice({
  tone,
  title,
  children,
  role,
  className,
}: {
  tone: NoticeTone;
  title?: string;
  children: ReactNode;
  role?: "status" | "alert";
  className?: string;
}) {
  const Icon = icons[tone];
  const resolvedRole = role ?? (tone === "error" ? "alert" : "status");

  return (
    <div className={`notice notice--${tone} ${className ?? ""}`} role={resolvedRole}>
      <Icon size={17} aria-hidden="true" className="notice__icon" />
      <div className="notice__body">
        {title ? <p className="notice__title">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function getNoticeTitle(tone: NoticeTone): string {
  return titles[tone];
}
