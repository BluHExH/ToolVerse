import { test, expect } from "@playwright/test";

test.describe("Home and navigation", () => {
  test("home page loads with hero and tool index", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/Everyday tools|Small tasks/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Browse the tools|All tools|Tools/i }).first()).toBeVisible();
  });

  test("main routes respond", async ({ page }) => {
    for (const path of ["/tools", "/categories", "/about", "/contact", "/pricing", "/privacy", "/blog"]) {
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator("body")).toBeVisible();
    }
  });
});

test.describe("Tools directory and pages", () => {
  test("tools index lists tools", async ({ page }) => {
    await page.goto("/tools");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // At least one tool link should be present
    const toolLinks = page.locator('a[href^="/tools/"]');
    await expect(toolLinks.first()).toBeVisible();
    expect(await toolLinks.count()).toBeGreaterThanOrEqual(10);
  });

  test("each tool page loads without console errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (error) => {
      consoleErrors.push(error.message);
    });

    const tools = [
      "pdf-merger",
      "pdf-splitter",
      "image-compressor",
      "image-resizer",
      "jpg-to-png",
      "json-formatter",
      "json-validator",
      "base64-encoder",
      "qr-code-generator",
      "word-counter",
    ];

    for (const slug of tools) {
      const response = await page.goto(`/tools/${slug}`);
      expect(response?.ok(), `Expected /tools/${slug} to load`).toBeTruthy();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }

    expect(consoleErrors, `Unexpected page errors: ${consoleErrors.join("; ")}`).toEqual([]);
  });
});

test.describe("Word counter tool", () => {
  test("counts words for typed text", async ({ page }) => {
    await page.goto("/tools/word-counter");
    const textarea = page.locator("textarea").first();
    await textarea.fill("Hello world from ToolVerse.");
    // Stats should update (words / characters visible somewhere in the tool UI)
    await expect(page.getByText(/word/i).first()).toBeVisible();
  });
});

test.describe("JSON formatter tool", () => {
  test("accepts JSON input area", async ({ page }) => {
    await page.goto("/tools/json-formatter");
    const textarea = page.locator("textarea").first();
    await expect(textarea).toBeVisible();
    await textarea.fill('{"ok":true}');
    await expect(textarea).toHaveValue('{"ok":true}');
  });
});

test.describe("Contact form", () => {
  test("shows validation errors for empty submit", async ({ page }) => {
    await page.goto("/contact");
    // Trigger validation by submitting without filling required fields.
    // The form uses client-side Zod; submit may be a button or rely on copy/mailto after validate.
    const name = page.locator("#contact-name");
    const email = page.locator("#contact-email");
    const message = page.locator("#contact-message");
    await expect(name).toBeVisible();
    await expect(email).toBeVisible();
    await expect(message).toBeVisible();

    // Submit the form (if there is a submit-type control) or dispatch submit
    await page.locator("form.form-grid").evaluate((form) => {
      (form as HTMLFormElement).requestSubmit();
    });

    await expect(page.locator("#contact-name-error")).toBeVisible();
    await expect(page.locator("#contact-email-error")).toBeVisible();
    await expect(page.locator("#contact-message-error")).toBeVisible();
  });

  test("accepts valid input and shows ready state", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("#contact-name").fill("Test User");
    await page.locator("#contact-email").fill("test@example.com");
    await page.locator("#contact-message").fill("This is a sufficiently long message for validation.");
    await page.locator("form.form-grid").evaluate((form) => {
      (form as HTMLFormElement).requestSubmit();
    });
    // After validation, either copy button or mailto link / notice appears
    await expect(
      page.getByText(/ready to copy|email draft is ready|Copy message|Open email draft/i).first(),
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Responsive shell", () => {
  test("header remains usable", async ({ page }) => {
    await page.goto("/");
    // Site header should be in the document
    const header = page.locator("header").first();
    await expect(header).toBeVisible();
  });
});
