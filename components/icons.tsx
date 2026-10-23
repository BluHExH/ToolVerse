import {
  AlignLeft,
  ArrowLeftRight,
  BadgeCheck,
  Binary,
  BookOpenText,
  Braces,
  CaseSensitive,
  Code,
  FileImage,
  FileText,
  Image as ImageIcon,
  KeyRound,
  Merge,
  Minimize2,
  Palette,
  QrCode,
  Scaling,
  Scissors,
  Type,
  WholeWord,
} from "lucide-react";
import type { CategorySlug } from "@/lib/categories";
import type { ToolIconName } from "@/lib/tools";

const toolIconMap = {
  merge: Merge,
  scissors: Scissors,
  minimize: Minimize2,
  scaling: Scaling,
  "file-image": FileImage,
  braces: Braces,
  "badge-check": BadgeCheck,
  binary: Binary,
  "qr-code": QrCode,
  "type-count": WholeWord,
  case: CaseSensitive,
  key: KeyRound,
  palette: Palette,
  markdown: BookOpenText,
  table: ArrowLeftRight,
} as const;

const categoryIconMap: Record<CategorySlug, typeof FileText> = {
  pdf: FileText,
  image: ImageIcon,
  text: Type,
  developer: Code,
};

export function ToolIcon({
  name,
  size = 20,
  className,
}: {
  name: ToolIconName;
  size?: number;
  className?: string;
}) {
  const Icon = toolIconMap[name] ?? AlignLeft;
  return <Icon size={size} aria-hidden="true" className={className} strokeWidth={1.9} />;
}

export function CategoryIcon({
  slug,
  size = 20,
  className,
}: {
  slug: CategorySlug;
  size?: number;
  className?: string;
}) {
  const Icon = categoryIconMap[slug] ?? FileText;
  return <Icon size={size} aria-hidden="true" className={className} strokeWidth={1.9} />;
}
