// Builds our source in packages/webawesome. Copies the runtime files into vsa/vendor/webawesome/ and the agent
// skills into .claude/skills/.
// Usage: node vsa/scripts/vendor-webawesome.mjs [--no-build]
// --no-build copies the output of the last build. The site and the apps load Web Awesome only from the vendor folder.
// Decision records: 0001 (our source) and 0004 (the icons next to the build).

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
// The build output is replaced. The icons folder stays: it is not a build output (decision 0004).
const OWN = new Set(['icons']);
fs.mkdirSync(to, { recursive: true });
for (const name of fs.readdirSync(to)) {
  if (!OWN.has(name)) fs.rmSync(path.join(to, name), { recursive: true, force: true });
}
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

// The agent skills are build output of our source. Replace each skill folder, so that a deleted reference file goes too.
const skillsFrom = path.join(pkg, 'dist', 'skills');
const skillsTo = path.join(root, '.claude', 'skills');
for (const name of ['webawesome', 'webawesome-design']) {
  fs.rmSync(path.join(skillsTo, name), { recursive: true, force: true });
  copy(path.join(skillsFrom, name), path.join(skillsTo, name));
}
console.log(`copied the skills webawesome and webawesome-design to ${skillsTo}`);
