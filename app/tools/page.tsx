import type { Metadata } from "next";
import { Download, Laptop, ListChecks } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ToolDirectory } from "@/components/tool-directory";
import { categories } from "@/lib/categories";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse all ToolVerse tools for PDFs, images, text, JSON, Base64, and QR codes. Every tool runs in your browser and includes clear limits.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "All Tools | ToolVerse",
    description:
      "Browse all ToolVerse tools for PDFs, images, text, JSON, Base64, and QR codes.",
    url: "/tools",
  },
};

export default function ToolsPage() {
  return (
    <div className="shell">
      <Breadcrumbs items={[{ label: "Tools" }]} />
      <div className="page-head">
        <p className="eyebrow eyebrow--rust">Tool directory</p>
        <h1 className="page-head__title">A complete toolbox, nothing extra</h1>
        <p className="page-head__lede">
          Tools that each do one job well. Search by task, filter by category, and open a tool to see exactly what
          it accepts before you start.
        </p>
        <div className="page-head__meta">
          <span>
            <ListChecks size={15} aria-hidden="true" /> {tools.length} tools across {categories.length} categories
          </span>
          <span>
            <Laptop size={15} aria-hidden="true" /> Processed in your browser
          </span>
          <span>
            <Download size={15} aria-hidden="true" /> Clear output and download steps
          </span>
        </div>
      </div>
      <ToolDirectory />
      <div style={{ height: "2rem" }} />
    </div>
  );
}
