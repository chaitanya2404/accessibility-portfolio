/**
 * Tiny CommonMark-ish renderer. Handles: ATX headings, paragraphs, fenced
 * code blocks, inline code, lists, links, and bold/italic. Output is escaped
 * by default and only known structures inject HTML. Adequate for trusted
 * markdown checked into the repo.
 */

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function escape(value: string): string {
  return value.replace(/[&<>"]/g, (c) => ESCAPE_MAP[c] ?? c);
}

function inline(text: string): string {
  let out = escape(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) =>
    `<a href="${escape(href)}" class="text-accent underline hover:text-accent-strong">${label}</a>`
  );
  return out;
}

export function renderMarkdown(src: string): string {
  const lines = src.split(/\r?\n/);
  const parts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const start = i + 1;
      let end = start;
      while (end < lines.length && !/^```/.test(lines[end])) end++;
      const code = lines.slice(start, end).join("\n");
      parts.push(
        `<pre class="overflow-x-auto rounded-md bg-surface-sunken p-3 text-xs"><code data-lang="${escape(lang)}">${escape(code)}</code></pre>`
      );
      i = end + 1;
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      // The page already renders an h1 for the doc title; demote markdown
      // headings by one level so the document outline stays valid.
      const level = Math.min(6, heading[1].length + 1);
      const sizes = ["text-2xl font-semibold", "text-xl font-semibold", "text-lg font-semibold", "text-base font-semibold"];
      const sizeClass = sizes[Math.min(level - 2, sizes.length - 1)];
      parts.push(`<h${level} class="${sizeClass} text-fg mt-8 mb-3">${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      parts.push(
        `<ul class="ml-5 list-disc space-y-1 text-fg-muted marker:text-accent">${items
          .map((item) => `<li>${inline(item)}</li>`)
          .join("")}</ul>`
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      parts.push(
        `<ol class="ml-5 list-decimal space-y-1 text-fg-muted marker:text-accent">${items
          .map((item) => `<li>${inline(item)}</li>`)
          .join("")}</ol>`
      );
      continue;
    }

    const buf: string[] = [line];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,4}\s/.test(lines[i]) && !/^[-*]\s+/.test(lines[i]) && !/^\d+\.\s+/.test(lines[i]) && !/^```/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    parts.push(`<p class="text-fg-muted leading-relaxed">${inline(buf.join(" "))}</p>`);
  }

  return parts.join("\n");
}
