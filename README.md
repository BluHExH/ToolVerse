# ToolVerse

Everyday tools. One simple place.

ToolVerse is a small collection of browser-based utilities for common tasks: merge and split PDFs, compress and resize images, format and validate JSON, encode Base64, generate QR codes, and count words. Every file tool runs entirely in your browser — nothing is uploaded to a server.

## Features

- **Ten focused tools**, all free, no account required
- **Local processing** for PDFs, images, text, JSON, Base64, and QR codes
- Categories: PDF, Image, Text, Developer
- Guides and blog articles about privacy and browser-based workflows
- Contact form that composes a message locally (mailto draft or copy)
- Accessible, responsive layout with a clear design system

### Tools

| Tool | What it does |
|------|----------------|
| **PDF Merger** | Combine multiple PDFs into one document |
| **PDF Splitter** | Extract page ranges into a new PDF |
| **Image Compressor** | Re-encode JPEG, PNG, or WebP with quality control |
| **Image Resizer** | Resize to exact dimensions with optional aspect lock |
| **JPG to PNG** | Convert JPEG images to PNG |
| **JSON Formatter** | Pretty-print or minify JSON |
| **JSON Validator** | Validate JSON and report parse errors with location |
| **Base64 Encoder** | Encode and decode UTF-8 text as Base64 |
| **QR Code Generator** | Create QR codes with contrast guidance |
| **Word Counter** | Words, characters, sentences, paragraphs, reading time |

File size limits (for example 50 MB per PDF, 25 MB per image) are documented on each tool page and exist because processing happens on your device.

## Technology stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [pdf-lib](https://pdf-lib.js.org/) — PDF merge/split in the browser
- [qrcode](https://github.com/soldair/node-qrcode) — QR generation
- [Zod](https://zod.dev/) — form validation
- [Lucide React](https://lucide.dev/) — icons
- [Vitest](https://vitest.dev/) — unit tests
- [Playwright](https://playwright.dev/) — end-to-end tests

## Prerequisites

- Node.js 20 or later (LTS recommended)
- npm 10 or later

## Installation

```bash
git clone https://github.com/BluHExH/ToolVerse.git
cd ToolVerse
npm install
```

## Environment variables

Create a `.env.local` file in the project root if you need to override defaults (this file is gitignored):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site origin used for metadata and absolute URLs. Defaults to `http://localhost:3000`. Example: `https://example.com` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Inbox address used by the contact form for a `mailto:` draft. If unset, the form still validates input and offers a copyable message. |

Never put private API keys or server-only secrets in `NEXT_PUBLIC_*` variables.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server (default: http://localhost:3000) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript) |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm test` | Unit tests (Vitest, single run) |
| `npm run test:lib` | Lightweight lib checks without full node_modules (Node strip-types) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run check` | lint → typecheck → unit tests → production build |

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Edit pages under `app/` and components under `components/`. Tool business logic lives in `lib/`.

## Production build

```bash
npm run build
npm start
```

The build outputs a standard Next.js production app. Security headers (content-type options, frame options, referrer policy, permissions policy) are applied in `next.config.ts`.

## Testing

### Unit tests

```bash
npm test
```

Tests cover pure logic in `lib/`:

- JSON parse, format, minify, and error reporting
- Base64 encode/decode and validation
- Text statistics (words, sentences, paragraphs, reading time)
- PDF page-range parsing and selection helpers
- QR payload validation and color contrast evaluation
- File name/extension helpers and dimension validation
- Image MIME/extension helpers

### End-to-end tests

```bash
npx playwright install   # once, if browsers are not installed
npm run test:e2e
```

E2E tests cover home page load, main navigation, tools directory and tool pages, contact form validation and copy/mailto behavior, and representative viewports.

## Contact form behavior

The contact form is **client-side only**:

1. Fields are validated with Zod (name, email, topic, message length).
2. On success, a plain-text message is composed in the browser.
3. If `NEXT_PUBLIC_CONTACT_EMAIL` is set, a “Open email draft” button uses `mailto:` with subject and body.
4. A “Copy message” (or “Copy instead”) control is always available.
5. **Nothing is sent to a ToolVerse server.** Delivery depends on the user’s email client (or on pasting the copied text into one).

There is no background API request, no message storage, and no automatic email delivery from the site itself.

## Privacy

- PDF, image, and text tools process data in the browser with the File APIs, canvas, and libraries such as pdf-lib.
- Files are not uploaded to ToolVerse servers by those tools.
- Closing the tab discards in-memory working data; the site does not keep a history of your inputs or outputs.
- See the [Privacy](./app/privacy/page.tsx) page in the app for the full statement that ships with the product.

## Project structure

```
app/                 App Router pages and layout
  tools/[slug]/      Individual tool pages
  categories/        Category listing and detail
  blog/              Guides
  contact/           Contact page
  pricing/           Free pricing statement
  privacy/           Privacy policy
  terms/             Terms
components/          Shared UI and tool UIs
  tools/             Per-tool React components
lib/                 Pure logic (JSON, PDF, QR, text, files, …)
hooks/               Client hooks
public/              Static assets (favicon, robots.txt, …)
tests/               Vitest unit tests
e2e/                 Playwright end-to-end tests
```

## Continuous integration

GitHub Actions workflow `.github/workflows/ci.yml` runs on pushes and pull requests to `main`:

1. `npm ci` (lockfile install)
2. `npm run lint`
3. `npm run typecheck`
4. `npm test` (Vitest unit tests)
5. `npm run build`

Playwright E2E tests are **not** part of the default CI job (browser install cost and longer runtime). Run them locally with `npm run test:e2e` after `npx playwright install`.

`npm run test:lib` is a lightweight, dependency-free check of pure `lib/` modules. It does **not** replace `npm test`.

## Deployment

This is a standard Next.js application. Suitable hosts include Vercel, Netlify, Cloudflare Pages, or any Node host that can run `next build` and `next start`.

1. Set `NEXT_PUBLIC_SITE_URL` to your public origin (no trailing slash).
2. Optionally set `NEXT_PUBLIC_CONTACT_EMAIL` for the contact form mailto target.
3. Build with `npm run build` and start with `npm start`, or use the host’s Next.js integration.

Do not commit `.env` or `.env.local` files.

## License

No license file is included in the repository at this time. Treat the project as proprietary unless the repository owner adds an explicit license.
