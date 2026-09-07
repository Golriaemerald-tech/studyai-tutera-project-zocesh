export function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

export function renderMarkdown(text: string): string {
  let s = esc(text)
    .replace(/\r/g, "")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h2>$1</h2>");

  // Bold and inline code first (so single-asterisk italics below doesn't eat
  // the ** pairs), then italics, then strikethrough.
  s = s
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/(?<!\*)\*(?!\*)([^*\n]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/(?<!_)_(?!_)([^_\n]+)_(?!_)/g, "<em>$1</em>")
    .replace(/~~(.*?)~~/g, "<del>$1</del>");

  // List items (unordered "- "/"• " and ordered "1. ") both become <li>,
  // then consecutive <li> runs get wrapped in a single <ul>.
  s = s
    .replace(/^\s*[-•]\s+(.*)$/gm, "<li>$1</li>")
    .replace(/^\s*\d+\.\s+(.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

  s = s.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
  return `<p>${s}</p>`;
}
