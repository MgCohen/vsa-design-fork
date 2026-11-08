// Takes screenshots of the built docs site on mobile and on desktop, in light and in dark.
// Usage: node vsa/scripts/screenshots.mjs [page ...]
// A page is a hash route, for example "/" or "/components/table". The default is a fixed set.
// Run vsa/scripts/build-artifact.mjs first. The script reads vsa/dist/vsa-design.html, and
// puts it in the same frame that the claude.ai artifact host adds, so the result is the published page.
// Output: vsa/dist/screenshots/<viewport>-<scheme>-<page>.png, and a report of each problem it finds.

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const vsa = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const built = path.join(vsa, 'dist', 'vsa-design.html');
const outDir = path.join(vsa, 'dist', 'screenshots');

const VIEWPORTS = {
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};
const SCHEMES = ['light', 'dark'];
const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/', '/gallery', '/foundations/typography', '/tokens/theme', '/components/button', '/components/table'];

// The frame of the artifact host. Keep it the same as the one claude.ai adds around a published page.
const HOST_FRAME =
  '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1">' +
  '<style>:root{color-scheme:light}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;' +
  'background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style>' +
  '</head><body>\n';

if (!fs.existsSync(built)) throw new Error(`${built} is missing. Run node vsa/scripts/build-artifact.mjs first.`);
const html = HOST_FRAME + fs.readFileSync(built, 'utf8');
const server = http
  .createServer((req, res) => {
    res.setHeader('content-type', 'text/html');
    res.end(html);
  })
  .listen(0);
const base = `http://localhost:${server.address().port}/`;

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const problems = [];
// The Playwright Chromium first. If it is not installed, the installed Google Chrome.
const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
try {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    for (const scheme of SCHEMES) {
      const context = await browser.newContext({ ...viewport, colorScheme: scheme });
      const page = await context.newPage();
      page.on('console', msg => {
        if (msg.type() === 'error') problems.push(`${viewportName} ${scheme}: console error: ${msg.text()}`);
      });
      page.on('pageerror', err => problems.push(`${viewportName} ${scheme}: page error: ${err.message}`));
      // We own every file we ship. The only outside host allowed is Google Fonts.
      page.on('request', req => {
        const host = new URL(req.url()).hostname;
        if (/^(localhost|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(host) || req.url().startsWith('data:'))
          return;
        problems.push(`${viewportName} ${scheme}: request to an outside host: ${req.url()}`);
      });
      for (const route of PAGES) {
        await page.goto(`${base}#${route}`);
        await page.waitForFunction(() => document.querySelector('main h1'), null, { timeout: 15000 });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(800);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        const width = await page.evaluate(() => window.innerWidth);
        if (width !== viewport.viewport.width)
          problems.push(`${viewportName}: the screen is ${width} px, not ${viewport.viewport.width} px`);
        if (overflow > 1)
          problems.push(`${viewportName} ${scheme} ${route}: the page is ${overflow} px wider than the screen`);
        const name = `${viewportName}-${scheme}-${route.replace(/^\/$/, 'overview').replace(/^\//, '').replace(/\//g, '-')}.png`;
        await page.screenshot({ path: path.join(outDir, name), fullPage: false });
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

console.log(`wrote ${fs.readdirSync(outDir).length} screenshots to ${outDir}`);
if (problems.length) {
  console.log(`${problems.length} problems:\n- ${problems.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log('no problems found: no console errors, no horizontal overflow');
}
