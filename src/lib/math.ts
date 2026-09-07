/**
 * Math output normalization.
 *
 * Gemini sometimes emits LaTeX-style notation ($...$, \frac{}, \sqrt{}, *,
 * ^, escaped sequences) that renders as ugly characters in a simple Markdown
 * renderer. This module cleans those up into plain Unicode that looks correct
 * for Nigerian secondary-school level content without a heavy MathJax/KaTeX
 * dependency.
 *
 * We do NOT blindly strip every `$` or `*` — see the targeted rules below.
 */

const LATEX_SYMBOLS: [RegExp, string][] = [
  [/\b\\times\b/g, "×"],
  [/\b\\div\b/g, "÷"],
  [/\b\\pm\b/g, "±"],
  [/\b\\mp\b/g, "∓"],
  [/\b\\leq\b/g, "≤"],
  [/\b\\le\b/g, "≤"],
  [/\b\\geq\b/g, "≥"],
  [/\b\\ge\b/g, "≥"],
  [/\b\\neq\b/g, "≠"],
  [/\b\\ne\b/g, "≠"],
  [/\b\\approx\b/g, "≈"],
  [/\b\\lt\b/g, "<"],
  [/\b\\gt\b/g, ">"],
  [/\b\\infty\b/g, "∞"],
  [/\b\\sum\b/g, "∑"],
  [/\b\\int\b/g, "∫"],
  [/\b\\cdot\b/g, "·"],
  [/\b\\ldots\b/g, "…"],
  [/\b\\alpha\b/g, "α"],
  [/\b\\beta\b/g, "β"],
  [/\b\\gamma\b/g, "γ"],
  [/\b\\theta\b/g, "θ"],
  [/\b\\pi\b/g, "π"],
  [/\b\\mu\b/g, "μ"],
  [/\b\\lambda\b/g, "λ"],
  [/\b\\sigma\b/g, "σ"],
  [/\b\\Delta\b/g, "Δ"],
  [/\b\\delta\b/g, "δ"],
  [/\b\\phi\b/g, "φ"],
  [/\b\\omega\b/g, "ω"],
  [/\b\\degree\b/g, "°"],
  [/\b\\percent\b/g, "%"],
  [/\b\\ldots\b/g, "…"],
];

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵",
  "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

const SUBSCRIPTS: Record<string, string> = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅",
  "6": "₆", "7": "₇", "8": "₈", "9": "₉",
};

/**
 * Normalise mathematical notation produced by an LLM so it renders cleanly
 * in the existing Markdown renderer.
 *
 * - Strips `$...$` and `$$...$$` delimiters (keeps inner content).
 * - Converts `\frac{a}{b}` → `(a)/(b)`.
 * - Converts `\sqrt{x}` → `√(x)` and `\sqrt[n]{x}` → `n√(x)`.
 * - Converts `\theta`, `\pi`, etc. → Unicode greek.
 * - Converts `*` between numbers/parens → `×`.
 * - Converts `x^2` → `x²` for single-digit exponents.
 * - Strips remaining LaTeX backslash commands that look like random text.
 */
export function normalizeMath(text: string): string {
  let s = text;

  // 1. Remove LaTeX math delimiters $...$ and $$...$$ — keep inner content.
  s = s.replace(/\$\$(.+?)\$\$/g, "$1");
  s = s.replace(/\$([^$\n]+?)\$/g, "$1");

  // 2. Convert LaTeX fractions and roots.
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");
  s = s.replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, "$1√($2)");
  s = s.replace(/\\sqrt\{([^}]+)\}/g, "√($1)");

  // 3. Convert common LaTeX symbols → Unicode.
  for (const [re, replacement] of LATEX_SYMBOLS) {
    s = s.replace(re, replacement);
  }

  // 4. Convert superscripts: base^digit → base + unicode superscript
  s = s.replace(/(\w)\)(\^-?\d)/g, "$1)$2"); // protect exponent after closing paren edge
  s = s.replace(/([a-zA-Z0-9)])\^(-?\d+)/g, (m, base, exp) => {
    if (exp.startsWith("-")) {
      return base + "⁻" + [...exp.slice(1)].map((d: string) => SUPERSCRIPTS[d] ?? d).join("");
    }
    return base + [...exp].map((d: string) => SUPERSCRIPTS[d] ?? d).join("");
  });

  // 5. Convert * multiplication (between numbers or closing/opening parens) → ×
  //    This is targeted: only when a digit or ) is followed by * then a digit or (.
  s = s.replace(/(\d|\))\s*\*\s*(\d|\()/g, "$1 × $2");

  // 6. Strip leftover LaTeX commands that would render as random text
  //    (e.g. \left, \right, \displaystyle, \begin{array}, \text{x}).
  s = s.replace(/\\text\{([^}]*)\}/g, "$1");
  s = s.replace(/\\begin\{[a-zA-Z]*\}([^\\]*)\\end\{[a-zA-Z]*\}/g, " ");
  s = s.replace(/\\(left|right|displaystyle|textstyle|frac|sqrt|sum|int|infty|cdot|ldots|times|div|pm|mp|leq|geq|neq|approx|lt|gt|alpha|beta|gamma|theta|pi|mu|lambda|sigma|Delta|delta|phi|omega|degree|percent)/g, "");

  // 7. Remove any remaining backslash escapes that don't map to known commands.
  //    Keep escaped math chars: \$ → keep (currency), \* → already handled.
  s = s.replace(/\\([\w.])/g, "$1");

  // 8. Collapse stray double braces from LaTeX: a{{b}} → a{b}
  s = s.replace(/\{\{([^}]*)\}\}/g, "{$1}");

  return s;
}

/** True if the text contains any LaTeX-style markup worth normalising. */
export function hasMathArtifacts(text: string): boolean {
  return /[\\$]/.test(text) || /\s\*\s.*[\d\(]/.test(text);
}
