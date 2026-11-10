# Inventory: what is Web Awesome and what is ours

This repo is VSA Design. It contains our own copy of Web Awesome 3.14.0 (MIT) and our design system on top of it. This file lists each part of the repo, where it comes from, and the rule for changes. The reference for "Web Awesome original" is the Web Awesome release tag `v3.14.0`.

## Origins

| Origin | Meaning | Rule |
|---|---|---|
| WA | A Web Awesome original, unchanged | Do not edit |
| WA, changed | A Web Awesome original with a listed change | Edit only with a decision record. List each change below |
| WA, generated | Build output of the Web Awesome source | Never edit by hand. Build it again |
| Ours | A file that VSA made | Edit with the checks in `AGENTS.md` |
| Third party | Another library, with its license | Do not edit. Replace the full version |

## Repo root

| Path | Origin | Note |
|---|---|---|
| `LICENSE.md` | WA | The MIT license. Keep it |
| `README.md`, `CONTRIBUTING.md` | WA | They describe the Web Awesome project |
| `package.json`, `package-lock.json` | WA | The build of `packages/webawesome` needs them |
| `tsconfig.base.json`, `prettier.config.js`, `lint-staged.config.js` | WA | Build and format configuration |
| `.editorconfig`, `.husky/`, `.vscode/` | WA | Editor and commit hooks |
| `.github/` | WA | Web Awesome CI and release workflows |
| `vercel.json`, `vercel.sh`, `VERSIONS.txt` | WA | Web Awesome site deploy and release list |
| `.gitignore`, `.prettierignore`, `cspell.json` | WA, changed | Our lines are at the end of each file |
| `.gitattributes` | Ours | Keeps the vendored files byte-exact |
| `AGENTS.md`, `INVENTORY.md` | Ours | Instructions for agents; this file |
| `.claude/skills/webawesome/` | WA, generated | Component reference, made from `src` and `docs/components` |
| `.claude/skills/webawesome-design/` | WA, generated | Design guidelines, copied from `scripts/design-skill/` |

## `packages/webawesome/`: the Web Awesome source

All files are Web Awesome originals, unchanged, except the files in "Changes to Web Awesome files".

| Path | Holds | Note |
|---|---|---|
| `src/` | Components, styles, themes, palettes | The source of all `wa-*` elements and tokens |
| `docs/docs/components/` | One docs page for each component | The docs site and the `webawesome` skill read them |
| `scripts/design-skill/` | The source of the `webawesome-design` skill | The design guidelines. Protect them |
| `CLAUDE.md` | How to work in the component source | Read it before a change in `src/` |

## `vsa/`: our design system

| Path | Origin | Holds |
|---|---|---|
| `theme/` | Ours | Palette, theme, looks, code block, fonts |
| `components/` | Ours | The `vsa-*` components and their API file |
| `setup.js` | Ours | Registers the vendored icons |
| `site/index.html` | Ours | The docs site |
| `docs/` | Ours | Usage pages, foundations, tokens, gallery, menu |
| `scripts/` | Ours | Build, check, screenshots, vendor scripts |
| `decisions/` | Ours | Decision records |
| `DESIGN.md`, `README.md` | Ours | Brief for agents; overview |
| `reference/custom-design/` | Ours | The design system from before the fork |
| `vendor/webawesome/` | WA, generated | Runtime files of our Web Awesome build |
| `vendor/webawesome/docs/components/` | WA | A copy of `packages/webawesome/docs/docs/components/` |
| `vendor/icons/` | Third party | Font Awesome Free icons, with `LICENSE.txt` |
| `vendor/marked/`, `vendor/highlight.js/` | Third party | Markdown and code colors for the docs site |

## Changes to Web Awesome files

| File | Change | Decision |
|---|---|---|
| `packages/webawesome/custom-elements-manifest.js` | Makes absolute module paths relative, so the build works on Windows | `vsa/decisions/0007-windows-build-fix.md` |
| `.gitignore`, `.prettierignore`, `cspell.json` | Lines for `vsa/` at the end | None. Configuration only |

## Open questions

- Repo root: the root `README.md` and `CONTRIBUTING.md` describe Web Awesome. Where do they go, and what is the VSA root `README.md`?
- `.github/`, `vercel.*`, `VERSIONS.txt`: do the Web Awesome workflows and deploy files stay?
- `vsa/vendor/webawesome/`: keep the build output in git, or build it on demand. This depends on how apps get the files.
- Each item under `vsa/`: review it one by one.
