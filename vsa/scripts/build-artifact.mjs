// Makes the docs site into one HTML file that can be published as a claude.ai artifact.
// Usage: node vsa/scripts/build-artifact.mjs [output]
// The default output is vsa/dist/vsa-design.html. Git ignores the dist/ folder.
// Requires Node 18 or later (fetch) and internet access to cdn.jsdelivr.net.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const vsa = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(vsa, 'site');
const out = path.resolve(process.argv[2] ?? path.join(vsa, 'dist', 'vsa-design.html'));

const read = rel => fs.readFileSync(path.resolve(site, rel), 'utf8');
const scriptSafe = text => text.replace(/<\/script/gi, '<\\/script');

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.text();
}

// Downloads a CDN stylesheet and puts each @import in its place.
async function inlineCss(url, seen = new Set()) {
  if (seen.has(url)) return '';
  seen.add(url);
  let css = await get(url);
  for (const m of [...css.matchAll(/@import\s+url\(['"]?([^'")]+)['"]?\)\s*([^;]*);/g)]) {
    if (m[2].trim()) throw new Error(`import with conditions: ${m[0]}`);
    css = css.replace(m[0], await inlineCss(new URL(m[1], url).href, seen));
  }
  const relative = css.match(/url\(\s*['"]?(?!data:|https?:|#)[^'")]+/g);
  if (relative) throw new Error(`${url} has relative url(): ${relative.slice(0, 3).join(', ')}`);
  return css;
}

// The artifact name in the claude.ai gallery comes from <title>. An older artifact is named "VSA Design System".
const ARTIFACT_TITLE = 'VSA on Web Awesome';

let html = read('index.html').replace(/<title>[^<]*<\/title>/, `<title>${ARTIFACT_TITLE}</title>`);

// 1. Local stylesheets. The fonts file only imports Google Fonts, so it becomes a link to that URL.
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) => {
  const css = read(href);
  if (href.endsWith('fonts.css')) return `<link rel="stylesheet" href="${css.match(/url\("([^"]+)"\)/)[1]}">`;
  return `<style data-source="${path.basename(href)}">\n${css}\n</style>`;
});

// 2. Local module scripts.
html = html.replace(
  /<script type="module" src="(\.\.\/[^"]+)"><\/script>/g,
  (m, src) => `<script type="module">\n${scriptSafe(read(src))}\n</script>`,
);

// 3. Web Awesome stylesheets from jsDelivr. An artifact page can load scripts from jsDelivr, but not stylesheets.
for (const [tag, href] of [
  ...html.matchAll(/<link rel="stylesheet" crossorigin="anonymous" href="(https:\/\/cdn\.jsdelivr\.net[^"]+)">/g),
]) {
  html = html.replace(tag, `<style data-source="${href.split('/').pop()}">\n${await inlineCss(href)}\n</style>`);
}

// 4. The docs files and the two manifests, as data. The site reads window.VSA_FILES before it fetches.
const docs = path.join(vsa, 'docs');
const files = {};
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else files[path.relative(docs, full).split(path.sep).join('/')] = fs.readFileSync(full, 'utf8');
  }
})(docs);
const waManifestUrl = html.match(/const MANIFEST_URL = '([^']+)'/)[1];
const data = `<script>
window.VSA_FILES = ${scriptSafe(JSON.stringify(files))};
window.VSA_MANIFEST = ${scriptSafe(fs.readFileSync(path.join(vsa, 'components', 'custom-elements.json'), 'utf8'))};
window.WA_MANIFEST = ${scriptSafe(await get(waManifestUrl))};
</script>
`;
html = html.replace(/<script>(\r?\n)const MANIFEST_URL/, m => data + m);

// Checks.
if (!html.includes('window.VSA_FILES =')) throw new Error('data script not placed');
if (/(href|src)="\.\.\//.test(html)) throw new Error('a relative file is still linked');
if (/<link rel="stylesheet"[^>]+jsdelivr/.test(html)) throw new Error('a CDN stylesheet is still linked');

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`wrote ${out}: ${(html.length / 1024).toFixed(0)} KB, ${Object.keys(files).length} docs files`);
