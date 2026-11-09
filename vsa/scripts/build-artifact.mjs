// Makes the docs site into one HTML file that can be published as a claude.ai artifact.
// Usage: node vsa/scripts/build-artifact.mjs [output]
// The default output is vsa/dist/vsa-design.html. Git ignores the dist/ folder.
// It uses only local files: vsa/ and the vendored Web Awesome build in vsa/vendor/. The only outside link is
// Google Fonts. Run vsa/scripts/vendor-webawesome.mjs first if vsa/vendor/webawesome is missing.

import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const vsa = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(vsa, 'site');
const vendor = path.join(vsa, 'vendor', 'webawesome');
const out = path.resolve(process.argv[2] ?? path.join(vsa, 'dist', 'vsa-design.html'));

const fromSite = rel => path.resolve(site, rel);
const scriptSafe = text => text.replace(/<\/script/gi, '<\\/script');
const posix = p => p.split(path.sep).join('/');

// The artifact name in the claude.ai gallery comes from <title>. An older artifact is named "VSA Design System".
const ARTIFACT_TITLE = 'VSA on Web Awesome';

// Reads a local stylesheet and puts each @import in its place, resolved from that file.
function inlineCss(file, seen = new Set()) {
  if (seen.has(file)) return '';
  seen.add(file);
  let css = fs.readFileSync(file, 'utf8');
  for (const m of [...css.matchAll(/@import\s+url\(['"]?([^'")]+)['"]?\)\s*([^;]*);/g)]) {
    if (/^https?:/.test(m[1])) continue;
    if (m[2].trim()) throw new Error(`${file}: import with conditions: ${m[0]}`);
    css = css.replace(m[0], () => inlineCss(path.resolve(path.dirname(file), m[1]), seen));
  }
  const relative = css.match(/url\(\s*['"]?(?!data:|https?:|#)[^'")]+/g);
  if (relative) throw new Error(`${file} has relative url(): ${relative.slice(0, 3).join(', ')}`);
  return css;
}

// Reads the attributes of one tag. Prettier can split a tag over several lines and close it with "/>".
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));

let html = fs
  .readFileSync(fromSite('index.html'), 'utf8')
  .replace(/<title>[^<]*<\/title>/, `<title>${ARTIFACT_TITLE}</title>`);

// 1. Stylesheets. The fonts file only imports Google Fonts, so it becomes a link to that URL.
//    Each other local stylesheet goes inline, with its imports.
for (const [tag] of [...html.matchAll(/<link\b[^>]*>/g)]) {
  const { rel, href } = attrs(tag);
  if (rel !== 'stylesheet' || /^https?:/.test(href)) continue;
  const file = fromSite(href);
  const replacement = href.endsWith('fonts.css')
    ? `<link rel="stylesheet" href="${fs.readFileSync(file, 'utf8').match(/url\(['"]?([^'")]+)['"]?\)/)[1]}">`
    : `<style data-source="${path.basename(href)}">\n${inlineCss(file)}\n</style>`;
  html = html.replace(tag, () => replacement);
}

// 2. Classic local scripts (the vendored docs libraries) go inline.
for (const [tag] of [...html.matchAll(/<script\b[^>]*><\/script>/g)]) {
  const { type, src } = attrs(tag);
  if (type === 'module' || !src || /^https?:/.test(src)) continue;
  html = html.replace(tag, () => `<script>\n${scriptSafe(fs.readFileSync(fromSite(src), 'utf8'))}\n</script>`);
}

// 3. Module scripts become one bundle. The page cannot load the 600 files of the vendored build one by one,
//    so every Web Awesome component is bundled, then the loader: it finds each element defined and only removes
//    wa-cloak. The local vsa-* modules follow, in page order.
const moduleTags = [...html.matchAll(/<script\b[^>]*><\/script>/g)]
  .map(([tag]) => ({ tag, ...attrs(tag) }))
  .filter(t => t.type === 'module' && t.src && !/^https?:/.test(t.src));
const imports = [];
for (const t of moduleTags) {
  const file = fromSite(t.src);
  if (path.basename(file) === 'webawesome.loader.js') {
    for (const name of fs.readdirSync(path.join(vendor, 'components')).sort()) {
      const component = path.join(vendor, 'components', name, `${name}.js`);
      if (fs.existsSync(component)) imports.push(component);
    }
  }
  imports.push(file);
}
const bundle = await build({
  stdin: {
    contents: imports.map(f => `import ${JSON.stringify(posix(f))};`).join('\n'),
    resolveDir: vsa,
    loader: 'js',
  },
  bundle: true,
  format: 'esm',
  minify: true,
  write: false,
  logLevel: 'error',
});
const bundled = bundle.outputFiles[0].text;
moduleTags.forEach((t, i) => {
  html = html.replace(t.tag, () => (i === 0 ? `<script type="module">\n${scriptSafe(bundled)}\n</script>` : ''));
});

// 4. The docs files and the two manifests, as data. The site reads window.VSA_FILES before it fetches.
const docs = path.join(vsa, 'docs');
const files = {};
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else files[posix(path.relative(docs, full))] = fs.readFileSync(full, 'utf8');
  }
})(docs);
// The Web Awesome component docs pages, under "wa/". The site shows their examples.
const waDocs = path.join(vsa, 'vendor', 'webawesome', 'docs', 'components');
for (const name of fs.readdirSync(waDocs))
  files[`wa/components/${name}`] = fs.readFileSync(path.join(waDocs, name), 'utf8');
// The vendored icons as data URLs, for vsa/setup.js. The page is one file, so it has no icon folder. It includes only
// the icons that a docs page or the site names, in all three folders, because the folder depends on the attributes.
const iconRoot = path.join(vsa, 'vendor', 'icons', 'svgs');
const text = Object.values(files).join('\n') + html;
const used = new Set([...text.matchAll(/\bname="([a-z0-9-]+)"/g)].map(m => m[1]));
const icons = {};
for (const folder of fs.readdirSync(iconRoot)) {
  for (const file of fs.readdirSync(path.join(iconRoot, folder))) {
    const name = file.replace(/\.svg$/, '');
    if (!used.has(name)) continue;
    const svg = fs.readFileSync(path.join(iconRoot, folder, file), 'utf8');
    icons[`${folder}/${name}`] = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
}
const waManifest = fromSite(html.match(/const MANIFEST_URL = '([^']+)'/)[1]);
const data = `<script>
window.VSA_ICONS = ${scriptSafe(JSON.stringify(icons))};
window.VSA_FILES = ${scriptSafe(JSON.stringify(files))};
window.VSA_MANIFEST = ${scriptSafe(fs.readFileSync(path.join(vsa, 'components', 'custom-elements.json'), 'utf8'))};
window.WA_MANIFEST = ${scriptSafe(fs.readFileSync(waManifest, 'utf8'))};
</script>
`;
html = html.replace(/<script>\s*const MANIFEST_URL/, m => data + m);

// Checks.
if (!html.includes('window.VSA_FILES =')) throw new Error('data script not placed');
const relative = html.match(/(href|src)="\.\.\/[^"]*"/);
if (relative) throw new Error(`a relative file is still linked: ${relative[0]}`);
const outside = [...html.matchAll(/<(?:link|script)\b[^>]*(?:href|src)="(https?:[^"]+)"/g)]
  .map(m => m[1])
  .filter(url => !url.startsWith('https://fonts.googleapis.com/'));
if (outside.length) throw new Error(`an outside file is still linked: ${outside.join(', ')}`);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(
  `wrote ${out}: ${(html.length / 1024).toFixed(0)} KB, ${Object.keys(files).length} docs files, ` +
    `${Object.keys(icons).length} icons, ${imports.length} modules bundled (${(bundled.length / 1024).toFixed(0)} KB)`,
);
