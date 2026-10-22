import Link from "next/link";
import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-hidden="true" className={cn("brand__mark", className)}>
      <rect x="1" y="1" width="30" height="30" rx="7" fill="var(--ink)" />
      <rect x="7" y="7" width="8" height="8" rx="1.6" fill="var(--paper)" />
      <rect x="17.5" y="7" width="7.5" height="8" rx="1.6" fill="var(--rust)" />
      <rect x="7" y="17.5" width="18" height="7.5" rx="1.6" fill="var(--paper)" opacity="0.82" />
    </svg>
  );
}

export function BrandLockup({
  className,
  href = "/",
  onNavigate,
}: {
  className?: string;
  href?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link href={href} className={cn("brand", className)} onClick={onNavigate}>
      <BrandMark />
      <span>ToolVerse</span>
    </Link>
  );
}
