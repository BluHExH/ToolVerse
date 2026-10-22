import Link from "next/link";
import { Compass, Search } from "lucide-react";
import { getFeaturedTools } from "@/lib/tools";
import { ToolCard } from "@/components/tool-card";

export default function NotFound() {
  const featured = getFeaturedTools().slice(0, 3);
  return (
    <div className="shell" style={{ minHeight: "60vh", display: "grid", alignContent: "center", gap: "2rem", paddingBlock: "4rem" }}>
      <div>
        <p className="eyebrow eyebrow--rust" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
          <Compass size={15} aria-hidden="true" /> Page not found
        </p>
        <h1 className="page-head__title" style={{ maxWidth: "32rem" }}>
          That link does not exist
        </h1>
        <p className="page-head__lede" style={{ marginTop: "1rem" }}>
          The page you were looking for may have been moved, renamed, or never built. The tool directory is the reliable
          way in.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1.5rem" }}>
          <Link href="/tools" className="btn btn--primary">
            <Search size={16} aria-hidden="true" /> Browse all tools
          </Link>
          <Link href="/" className="btn btn--secondary">
            Go home
          </Link>
        </div>
      </div>

      <div>
        <h2 className="section__title" style={{ marginBottom: "1rem" }}>
          Useful tools while you are here
        </h2>
        <div className="tool-grid">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}
