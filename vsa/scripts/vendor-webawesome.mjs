// Builds Web Awesome from packages/webawesome and copies the runtime files into vsa/vendor/webawesome/.
// Usage: node vsa/scripts/vendor-webawesome.mjs [--no-build]
// --no-build copies the output of the last build. The site and the apps load Web Awesome only from the vendor folder.
// Decision records: 0005 (own build) and 0007 (the build fix for Windows).

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const pkg = path.join(root, 'packages', 'webawesome');
const from = path.join(pkg, 'dist-cdn');
const to = path.join(root, 'vsa', 'vendor', 'webawesome');

// The runtime files. Not copied: the docs pages (the docs site reads them from the source), type files, the React wrappers, SSR, the skills, llms.txt and editor data.
const KEEP = [
  'chunks',
  'components',
  'events',
  'internal',
  'styles',
  'translations',
  'utilities',
  'webawesome.js',
  'webawesome.loader.js',
  'custom-elements.json',
];
const SKIP_FILE = /\.d\.ts$/;

if (!process.argv.includes('--no-build')) {
  // The build writes "llms.txt" last. That step fails on Windows and is not needed here, so its exit code is ignored
  // when the runtime files exist.
  try {
    execSync('npm run build', { cwd: pkg, stdio: 'inherit' });
  } catch (error) {
    if (!fs.existsSync(path.join(from, 'webawesome.loader.js'))) throw error;
    console.warn('The build reported an error after the runtime files were written. Continuing.');
  }
}

const version = JSON.parse(fs.readFileSync(path.join(pkg, 'package.json'), 'utf8')).version;
fs.rmSync(to, { recursive: true, force: true });
let count = 0;
const copy = (src, dst) => {
  if (fs.statSync(src).isDirectory()) {
    for (const name of fs.readdirSync(src)) copy(path.join(src, name), path.join(dst, name));
  } else if (!SKIP_FILE.test(src)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    count++;
  }
};
for (const name of KEEP) copy(path.join(from, name), path.join(to, name));
fs.writeFileSync(
  path.join(to, 'VERSION.txt'),
  `Web Awesome ${version}, built from packages/webawesome by vsa/scripts/vendor-webawesome.mjs.\nDo not edit these files. Change the source, then run the script again.\n`,
);
console.log(`copied ${count} files of Web Awesome ${version} to ${to}`);
