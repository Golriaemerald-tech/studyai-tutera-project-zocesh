import { normalizeMath } from "./math";

export function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

/**
 * Renders Markdown-ish text to safe HTML.
 *
 * The `math` option (default true) runs `normalizeMath` first so that
 * LaTeX artifacts from the AI ($…$, \frac, *, escaped commands) are
 * converted to clean Unicode before Markdown parsing. This prevents
 * literal `$` and `*` characters from leaking into the rendered output.
 */
export function renderMarkdown(text: string, options?: { math?: boolean }): string {
  let s = options?.math === false ? text : normalizeMath(text);
  s = esc(s).replace(/\r/g, "");

  // Headings — process longest first so ## isn't swallowed by #.
  s = s
    .replace(/^\s*###### (.*)$/gm, "<h6>$1</h6>")
    .replace(/^\s*##### (.*)$/gm, "<h5>$1</h5>")
    .replace(/^\s*#### (.*)$/gm, "<h4>$1</h4>")
    .replace(/^\s*### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^\s*## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^\s*# (.*)$/gm, "<h1>$1</h1>");

  // Bold / strong, inline code, strikethrough — processed before italics
  // so the ** pairs are consumed before single-* rules run.
  s = s
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/~~(.*?)~~/g, "<del>$1</del>")
    .replace(/(?<!\*)\*(?!\*)([^*\n]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/(?<!_)_(?!_)([^_\n]+)_(?!_)/g, "<em>$1</em>");

  // Blockquotes
  s = s.replace(/^\s*> (.*)$/gm, "<blockquote>$1</blockquote>");

  // Horizontal rule
  s = s.replace(/^\s*---\s*$/gm, "<hr>");

  // List items: unordered (-, •, *) and ordered (1., 2.) — both become <li>
  s = s
    .replace(/^\s*[-•]\s+(.*)$/gm, "<li>$1</li>")
    .replace(/^\s*\d+\.\s+(.*)$/gm, "<li>$1</li>");
  // Wrap consecutive <li> runs in a single <ul>
  s = s.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

  // Split into paragraphs (double newline) then single newlines to <br>.
  s = s.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");

  // If the content starts with a block-level element, the leading/trailing
  // <p> wrapper is invalid — strip it.
  if (/<(?:h[1-6]|blockquote|hr|ul|ol)\b/.test(s)) {
    s = s.replace(/^<p>/, "");
    s = s.replace(/<\/p>$/, "");
  }

  return `<p>${s}</p>`;
}
