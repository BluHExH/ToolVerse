export const siteConfig = {
  name: "ToolVerse",
  tagline: "Everyday tools. One simple place.",
  description:
    "Ten focused browser tools for PDFs, images, text, JSON, Base64, and QR codes. No account, no upload, no detours.",
  locale: "en_US",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
  contactEmail: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim(),
  twitterHandle: "",
} as const;

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
