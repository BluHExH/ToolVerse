import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { absoluteUrl } from "@/lib/site";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ label: "Home", href: "/" }, ...items];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {index > 0 ? <ChevronRight size={13} aria-hidden="true" /> : null}
              {item.href && !isLast ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        // Structured data reflects the visible breadcrumb trail only.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </nav>
  );
}
