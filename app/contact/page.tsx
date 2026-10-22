import type { Metadata } from "next";
import { Clock, Mail, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ToolVerse about a bug, a tool suggestion, or a privacy question. The form prepares an email draft locally; it does not upload your message.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | ToolVerse",
    description: "Contact ToolVerse about a bug, a tool suggestion, or a privacy question.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="shell">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <div className="page-head">
        <p className="eyebrow eyebrow--rust">Contact</p>
        <h1 className="page-head__title">Tell us what you need</h1>
        <p className="page-head__lede">
          Use the form to report a problem, suggest a tool, or ask a privacy question. The page composes a message on
          your device and hands it to your email app — it does not send or store anything itself.
        </p>
      </div>

      <div className="contact-layout" style={{ paddingBottom: "3rem" }}>
        <div className="workspace">
          <div className="workspace__top">
            <h2 className="workspace__title">
              <Mail size={16} aria-hidden="true" /> Write a message
            </h2>
          </div>
          <div className="workspace__body">
            <ContactForm />
          </div>
        </div>

        <aside className="tool-sidebar">
          <div className="aside-card">
            <h2 className="aside-card__title">Before you write</h2>
            <p className="muted" style={{ fontSize: "0.88rem" }}>
              Many questions are already answered on the site:
            </p>
            <ul style={{ marginTop: "0.75rem", paddingLeft: "1.2rem", color: "var(--ink-soft)", fontSize: "0.88rem" }}>
              <li>File-size limits are listed on each tool page.</li>
              <li>
                The <a href="/privacy">privacy page</a> describes processing and data handling.
              </li>
              <li>
                The <a href="/pricing">pricing page</a> explains the free model.
              </li>
            </ul>
          </div>

          <div className="aside-card">
            <h2 className="aside-card__title">How this form works</h2>
            <ul className="check-list" style={{ marginTop: "0.85rem" }}>
              <li>
                <ShieldCheck size={17} aria-hidden="true" />
                <span>No request is made in the background when you type or submit.</span>
              </li>
              <li>
                <Clock size={17} aria-hidden="true" />
                <span>The draft is created locally and can be edited before sending.</span>
              </li>
              <li>
                <Mail size={17} aria-hidden="true" />
                <span>
                  Inbox address configured for this deployment:{" "}
                  <strong>{siteConfig.contactEmail || "not configured"}</strong>
                </span>
              </li>
            </ul>
            <p className="muted" style={{ marginTop: "1rem", fontSize: "0.84rem" }}>
              Operators set <code className="mono">NEXT_PUBLIC_CONTACT_EMAIL</code> to connect the draft to a real
              inbox. Without it, the form still creates a copyable message.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
