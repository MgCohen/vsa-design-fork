# Inventory: what is Web Awesome and what is ours

This repo is VSA Design. Its source starts from Web Awesome 3.14.0 (MIT), and our design system is on top of it (decision `vsa/decisions/0001-our-source-from-web-awesome.md`). This file lists each part of the repo, where it comes from, and the rule for changes. The origin is the Web Awesome release tag `v3.14.0`. The list of changes to the origin is the git history: `git diff v3.14.0 -- packages/webawesome`.

## Origins

| Origin | Meaning | Rule |
|---|---|---|
| WA origin | Our source. It starts as a Web Awesome file | Edit it. A change to the system needs a decision record (`0001`) |
| WA system | A guideline or a convention that the skills depend on | Change only with a decision record |
| Generated | Build output of our source | Never edit by hand. Build it again |
| WA project | A Web Awesome project file that we did not review yet | Do not edit until the root review |
| Ours | A file that VSA made | Edit with the checks in `AGENTS.md` |
| Third party | Another library, with its license | Do not edit. Replace the full version |

## Repo root

| Path | Origin | Note |
|---|---|---|
| `LICENSE.md` | WA project | The MIT license. Keep it |
| `README.md`, `CONTRIBUTING.md` | WA project | They describe the Web Awesome project |
| `package.json`, `package-lock.json` | WA project | The build of `packages/webawesome` needs them |
| `tsconfig.base.json`, `prettier.config.js`, `lint-staged.config.js` | WA project | Build and format configuration |
| `.editorconfig`, `.husky/`, `.vscode/` | WA project | Editor and commit hooks |
| `.github/` | WA project | Web Awesome CI and release workflows |
| `vercel.json`, `vercel.sh`, `VERSIONS.txt` | WA project | Web Awesome site deploy and release list |
| `.gitignore`, `.prettierignore`, `cspell.json` | WA project | Our lines are at the end of each file |
| `.gitattributes` | Ours | Keeps the vendored files byte-exact |
| `AGENTS.md`, `INVENTORY.md` | Ours | Instructions for agents; this file |
| `.claude/skills/webawesome/` | Generated | Component reference, made from `src` and `docs/components` |
| `.claude/skills/webawesome-design/` | Generated | Design guidelines, copied from `scripts/design-skill/` |

## `packages/webawesome/`: our source

| Path | Origin | Holds |
|---|---|---|
| `src/` | WA origin | Components, styles, themes, palettes, layers |
| `docs/docs/components/` | WA origin | One docs page for each component. The docs site and the `webawesome` skill read them |
| `scripts/design-skill/` | WA system | The source of the `webawesome-design` skill: the design guidelines |
| `CLAUDE.md` | WA origin | How to work in the component source. Read it before a change in `src/` |
| Other files | WA origin | Build, tests, scripts |

## `vsa/`: our design system

| Path | Origin | Holds |
|---|---|---|
| `theme/` | Ours | Palette, theme, looks, code block, fonts |
| `components/` | Ours | The `vsa-*` components and their API file |
| `site/index.html` | Ours | The docs site |
| `docs/` | Ours | Usage pages, foundations, tokens, gallery, menu |
| `scripts/` | Ours | Build, check, screenshots, vendor scripts |
| `decisions/` | Ours | Decision records |
| `DESIGN.md`, `README.md` | Ours | Brief for agents; overview |
| `vendor/webawesome/` | Generated | Runtime files of our Web Awesome build |
| `vendor/webawesome/icons/` | Third party | Font Awesome Free icons, with `LICENSE.txt`. The default icons of our build (`0004`). `vendor-webawesome.mjs` keeps this folder |
| `vendor/marked/`, `vendor/highlight.js/` | Third party | Markdown and code colors for the docs site |

## Open questions

- Repo root: the root `README.md` and `CONTRIBUTING.md` describe Web Awesome. Where do they go, and what is the VSA root `README.md`?
- `.github/`, `vercel.*`, `VERSIONS.txt`: do the Web Awesome workflows and deploy files stay?
- `vsa/vendor/webawesome/`: keep the build output in git, or build it on demand. This depends on how apps get the files.
- Each item under `vsa/`: review it one by one.
- Names: when the review is complete, the docs are correct and everything works, which names that say "Web Awesome" or "vendor" do we change? Paths and files (`vendor-webawesome.mjs`, `vsa/vendor/webawesome/`, `packages/webawesome/`) are a normal change. System names (`wa-*`, `--wa-*`, `wa-theme-*`, the skill names) need a decision record (`0001`), because the skills, the docs and the apps depend on them.
