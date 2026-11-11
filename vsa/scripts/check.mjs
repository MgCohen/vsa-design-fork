// Checks our files against the Web Awesome design guidelines and the VSA rules.
// Usage: node vsa/scripts/check.mjs
// It runs the searches of the webawesome-design skill ("Verify before you finish") and the rules of AGENTS.md and
// vsa/decisions/0002. Each finding names the file, the line and the rule. The exit code is 1 when there is a finding.
// Not checked: vsa/vendor (built files), vsa/dist (build output), vsa/scripts and vsa/decisions.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const vsa = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['vendor', 'dist', 'scripts', 'decisions']);
const EXT = /\.(css|js|html|md)$/;

const files = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (!SKIP.has(name)) walk(full);
    } else if (EXT.test(name)) files.push(full);
  }
})(vsa);

const rel = f => path.relative(vsa, f).split(path.sep).join('/');
const THEME_FILES = new Set(['theme/palette.css', 'theme/theme.css', 'theme/looks.css', 'theme/code.css']);

// Each rule: the files it applies to, a pattern for one line, and the reason, with where the rule comes from.
const RULES = [
  {
    name: 'hex color',
    applies: f => rel(f) !== 'theme/palette.css' && !f.endsWith('.md'),
    test: line => /#[0-9a-fA-F]{3,8}\b/.test(line) && !/&#\d+;|#\/|href="#|url\(#/.test(line),
    why: 'Hex colors only in theme/palette.css (AGENTS.md, 0002). Use a palette tint or a role.',
  },
  {
    name: 'px size',
    applies: f => !THEME_FILES.has(rel(f)),
    test: line => /\b\d+(\.\d+)?px\b/.test(line),
    allow: [{ file: 'components/vsa-table.js', text: 'width: 1px; height: 1px' }],
    why: 'No px outside the theme files (DESIGN.md). Use a token. The one exception is the visually hidden pattern.',
  },
  {
    name: '::part(base)',
    applies: () => true,
    test: line => /::part\(base\)/.test(line) && !/Do not style/.test(line),
    why: 'The base part is deprecated (webawesome-design skill). Use the part named after the component.',
  },
  {
    name: 'self-closed custom element',
    applies: () => true,
    test: line => /<(wa|vsa)-[a-z-]+[^>]*\/>/.test(line),
    why: 'Custom elements never self-close (webawesome-design skill).',
  },
  {
    name: 'deprecated size',
    applies: () => true,
    test: line => /size="(small|medium|large)"/.test(line) && !/Do not use/.test(line),
    why: 'Use the sizes s, m and l (DESIGN.md).',
  },
  {
    name: '--wa-* token set outside the theme',
    applies: f => !['theme/palette.css', 'theme/theme.css'].includes(rel(f)) && /\.(css|html)$/.test(f),
    test: line => /(^|[{;])\s*--wa-[a-z0-9-]+\s*:/.test(line),
    why: 'Set --wa-* tokens only in theme/theme.css, hues only in theme/palette.css (AGENTS.md, 0002).',
  },
  {
    name: 'hand-written flex or grid',
    applies: f => /\.(css|html)$/.test(f),
    test: line => /display:\s*(inline-)?(flex|grid)\b/.test(line),
    why: 'Use wa-stack, wa-cluster, wa-grid and wa-page for layout (DESIGN.md, webawesome-design skill).',
  },
  {
    name: 'outside link',
    applies: f => f.endsWith('.html'),
    test: line =>
      /(href|src)="https?:\/\//.test(line) && !/fonts\.googleapis\.com/.test(line) && !/target="_blank"/.test(line),
    why: 'We own every file we ship (0001). Load from vsa/vendor. Google Fonts is the one exception.',
  },
];

// Host rules that set a visual property on a wa-* element, outside its parts. The card has no part for its surface.
const HOST_ALLOW = new Set(['wa-card']);
function hostRules(file, text) {
  const out = [];
  const re = /(^|\n)([ \t]*)(wa-[a-z-]+)([^{\n]*)\{([^}]*)\}/g;
  for (const m of text.matchAll(re)) {
    const [, , , tag, rest, body] = m;
    // A descendant selector (wa-page main) styles a child, not the host.
    if (
      /::part|::slotted/.test(rest) ||
      /\s+[a-z.#[]/i.test(rest.replace(/\[[^\]]*\]/g, '').trimEnd()) ||
      HOST_ALLOW.has(tag)
    )
      continue;
    const visual = body
      .split(';')
      .map(d => d.trim())
      .filter(d => /^(background|color|border|padding|box-shadow)\b/.test(d));
    if (visual.length) {
      const line = text.slice(0, m.index + m[1].length).split('\n').length;
      out.push({
        file,
        line,
        rule: 'visual host rule',
        text: `${tag}${rest.trim()} { ${visual.join('; ')} }`,
        why: 'Style a component with tokens, attributes or a documented part, not on its host (webawesome-design skill).',
      });
    }
  }
  return out;
}

const findings = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  for (const rule of RULES) {
    if (!rule.applies(file)) continue;
    lines.forEach((line, i) => {
      if (!rule.test(line)) return;
      if (rule.allow?.some(a => rel(file) === a.file && line.includes(a.text))) return;
      findings.push({ file, line: i + 1, rule: rule.name, text: line.trim().slice(0, 120), why: rule.why });
    });
  }
  if (/\.(css|html)$/.test(file)) findings.push(...hostRules(file, text));
}

for (const f of findings) console.log(`${rel(f.file)}:${f.line}  ${f.rule}: ${f.text}\n    ${f.why}`);
console.log(
  findings.length ? `${findings.length} findings in ${files.length} files` : `no findings in ${files.length} files`,
);
process.exitCode = findings.length ? 1 : 0;
