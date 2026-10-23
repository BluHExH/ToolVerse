"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { z } from "zod";
import { siteConfig } from "@/lib/site";
import { CopyButton } from "@/components/tools/copy-button";
import { Notice } from "@/components/notice";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Add a name so we know who to reply to."),
  fromEmail: z.string().trim().email("Add a valid email address we can reply to."),
  topic: z.enum(["bug", "feature", "privacy", "general"]),
  message: z.string().trim().min(20, "Give us at least 20 characters of detail."),
});

interface FormData {
  name: string;
  fromEmail: string;
  topic: string;
  message: string;
}

const TOPIC_LABELS: Record<string, string> = {
  bug: "Report a problem",
  feature: "Suggest a tool or improvement",
  privacy: "Privacy question",
  general: "Something else",
};

export function ContactForm() {
  const [form, setForm] = useState<FormData>({ name: "", fromEmail: "", topic: "general", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const composed = [
    `From: ${form.name} <${form.fromEmail}>`,
    `Topic: ${TOPIC_LABELS[form.topic]}`,
    "",
    form.message,
  ].join("\n");

  const mailtoHref = siteConfig.contactEmail
    ? `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
        `[ToolVerse] ${TOPIC_LABELS[form.topic]} — ${form.name}`,
      )}&body=${encodeURIComponent(composed)}`
    : null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const update = (field: keyof FormData) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      <div className="form-grid__row">
        <div className="field">
          <label className="field__label" htmlFor="contact-name">
            Your name
          </label>
          <input
            id="contact-name"
            className="input"
            value={form.name}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onChange={(event) => update("name")(event.target.value)}
          />
          {errors.name ? (
            <p className="field-error" id="contact-name-error">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="field">
          <label className="field__label" htmlFor="contact-email">
            Email address
          </label>
          <input
            id="contact-email"
            className="input"
            type="email"
            value={form.fromEmail}
            autoComplete="email"
            aria-invalid={Boolean(errors.fromEmail)}
            aria-describedby={errors.fromEmail ? "contact-email-error" : undefined}
            onChange={(event) => update("fromEmail")(event.target.value)}
          />
          {errors.fromEmail ? (
            <p className="field-error" id="contact-email-error">
              {errors.fromEmail}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="contact-topic">
          Topic
        </label>
        <select
          id="contact-topic"
          className="select"
          value={form.topic}
          onChange={(event) => update("topic")(event.target.value)}
        >
          {Object.entries(TOPIC_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="contact-message">
          Message
          <span className="field__hint">{form.message.length} characters</span>
        </label>
        <textarea
          id="contact-message"
          className="textarea"
          rows={6}
          value={form.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          onChange={(event) => update("message")(event.target.value)}
        />
        {errors.message ? (
          <p className="field-error" id="contact-message-error">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
        {mailtoHref ? (
          <a className="btn btn--primary" href={mailtoHref}>
            <Send size={16} aria-hidden="true" /> Open email draft
          </a>
        ) : (
          <CopyButton text={composed} label="Copy message" className="btn btn--primary" />
        )}
        {mailtoHref ? <CopyButton text={composed} label="Copy instead" className="btn btn--secondary" /> : null}
      </div>

      {submitted && composed ? (
        <Notice tone="info" title={mailtoHref ? "Your email draft is ready" : "Your message is ready to copy"}>
          {mailtoHref
            ? `Use "Open email draft" to send it to ${siteConfig.contactEmail} with your email app. Nothing was sent by this page itself.`
            : "The form composes a message; it does not send anything from the site. Copy it above and paste it into your email app."}
        </Notice>
      ) : null}
    </form>
  );
}
