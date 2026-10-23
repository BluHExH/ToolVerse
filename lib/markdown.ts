/** Minimal safe Markdown → HTML (escape first, then apply a small subset). */
export function markdownToHtml(source: string): string {
  const escaped = source
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const parts = escaped.split(/(```[\s\S]*?```)/g);

  const rendered = parts
    .map((part) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const body = part.slice(3, -3).replace(/^\w*\n/, "");
        return `<pre class="md-pre"><code>${body.trimEnd()}</code></pre>`;
      }
      return renderBlocks(part);
    })
    .join("\n");

  return rendered;
}

function renderBlocks(text: string): string {
  const lines = text.split("\n");
  const out: string[] = [];
  let list: string[] | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      out.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
      list = null;
    }
  };

  for (const line of lines) {
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushPara();
      flushList();
      const level = heading[1]!.length;
      out.push(`<h${level}>${inline(heading[2]!.trim())}</h${level}>`);
      continue;
    }
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) {
      flushPara();
      if (!list) list = [];
      list.push(bullet[1]!);
      continue;
    }
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return out.join("\n");
}

function inline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" rel="noopener noreferrer" target="_blank">$1</a>',
    );
}
