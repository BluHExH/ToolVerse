import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { categories } from "@/lib/categories";
import { tools } from "@/lib/tools";
import { siteConfig } from "@/lib/site";
import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer on-dark">
      <div className="shell">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link href="/" className="footer-mark">
              <BrandMark />
              <span>ToolVerse</span>
            </Link>
            <p>{siteConfig.tagline} Ten focused tools for documents, images, text, and data.</p>
            <p style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginTop: "1rem" }}>
              <ShieldCheck size={16} aria-hidden="true" style={{ flex: "none", marginTop: "0.2rem" }} />
              <span>Files and text are processed in your browser. ToolVerse does not upload them.</span>
            </p>
          </div>

          <nav aria-label="Tools">
            <h2 className="site-footer__heading">Tools</h2>
            <ul className="site-footer__list">
              {tools.slice(0, 5).map((tool) => (
                <li key={tool.slug}>
                  <Link href={tool.href}>{tool.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/tools">All tools</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Categories">
            <h2 className="site-footer__heading">Categories</h2>
            <ul className="site-footer__list">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/categories/${category.slug}`}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company and legal">
            <h2 className="site-footer__heading">ToolVerse</h2>
            <ul className="site-footer__list">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/blog">Guides</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} ToolVerse</span>
          <span>Everyday tools. One simple place.</span>
        </div>
      </div>
    </footer>
  );
}
