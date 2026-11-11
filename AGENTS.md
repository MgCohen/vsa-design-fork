# AGENTS.md

Instructions for AI coding agents (and humans) that work in this repository. This file is model-agnostic.

## Project

VSA Design is the design system of VSA apps: components, behaviors, style, docs and agent skills. It starts from a copy of Web Awesome `v3.14.0` (MIT). We own all of it, and we change it step by step. The changes include our style, and later our own behaviors and ways of working. Until a decision record says otherwise, we keep the Web Awesome system: names, cascade layers, the theme model and the component API pattern, because the skills depend on it. See `vsa/decisions/0001-our-source-from-web-awesome.md`.

Today, our style is a named theme over the default theme (`vsa/decisions/0002-theme-and-palette.md`). Each part of the repo and its origin is in `INVENTORY.md`.

| Path | Content | Origin |
|---|---|---|
| `packages/webawesome/` | Our source: components, themes, build, tests | Started from Web Awesome 3.14.0 |
| `vsa/` | Our style, our `vsa-*` components, the docs site, the decisions. See `vsa/README.md` | Ours |
| `vsa/DESIGN.md` | The design brief: the vocabulary, the conventions, the don'ts | Ours |
| `.claude/skills/` | The agent skills `webawesome` and `webawesome-design` | Generated from our source |

The default branch is `main`.

## Read first

1. `vsa/DESIGN.md`. It has priority over the skills. The design skill also says that the project brief comes first.
2. The skill for the task:
   - `webawesome`: the API of one component, for example its attributes, slots, events and parts.
   - `webawesome-design`: layout, theming, tokens and composition.
3. `packages/webawesome/CLAUDE.md`, if you change a component in our source.
4. `INVENTORY.md`, before you change a file whose origin you do not know.

An agent that does not load skills by itself can read the files: `.claude/skills/<skill>/SKILL.md`, then the files in its `references/` folder.

## Rules

- A change to the system needs a decision record: a token name, a cascade layer, the theme model, a component API (attribute, slot, part, custom state, event), or the guideline source `packages/webawesome/scripts/design-skill/`. A change inside a component needs no record. See `0001`.
- In `vsa/`, put hex colors only in `vsa/theme/palette.css`. A role in `vsa/theme/theme.css` refers to a palette tint.
- In `vsa/`, set `--wa-*` tokens only in `vsa/theme/theme.css`, and only if the value differs from the default theme. Set sizes through the scale controls. The exceptions are the shadows and the focus ring. See `0002`.
- An app sets its own values in its own stylesheet, with no cascade layer.
- Make a `--vsa-*` token only for an idea that Web Awesome has no token for.
- An own component uses the `vsa-` prefix, reads `--wa-*` tokens, and uses the custom property names of the nearest Web Awesome component.
- Use the sizes `s`, `m` and `l`. Do not use `::part(base)`.
- Do not edit `.claude/skills/` by hand. Build it from our source (see "Update the skills"). Put our rules in `vsa/DESIGN.md`.
- Use no Web Awesome Pro code. Keep `LICENSE.md` and the Web Awesome copyright notice.

## Update the skills

The skills are build output of our source. They describe our components only after a build and a copy.

1. Run `npm run build` in `packages/webawesome/`.
2. Copy `packages/webawesome/dist/skills/webawesome/` and `packages/webawesome/dist/skills/webawesome-design/` to `.claude/skills/`.
3. Commit the changed skill files with the source change that caused them.

## Verify a change

Check each visible change on mobile and on desktop, in light and in dark. A change that looks correct on one screen size can break the other.

In a new clone, run `npm ci` in the repo root first. The scripts need `esbuild` and `playwright`.

1. Run `node vsa/scripts/check.mjs`. It checks the Web Awesome design rules and our rules: hex colors only in the palette, `--wa-*` tokens only in the theme, no px, no `::part(base)`, no visual host rules, no hand-written flex or grid, no outside links. Fix each finding.
2. Run `node vsa/scripts/build-artifact.mjs`.
3. Run `node vsa/scripts/screenshots.mjs`. Add hash routes to check other pages, for example `node vsa/scripts/screenshots.mjs /components/table`. In Git Bash, put `MSYS_NO_PATHCONV=1` <!-- cspell:disable-line --> before the command, or Git Bash changes `/components/table` into a Windows path.
4. Look at the screenshots in `vsa/dist/screenshots/`: mobile (390 px) and desktop (1440 px), light and dark, for each page.
5. If the script reports a problem, fix it. It reports console errors, page errors, a page that is wider than the screen, a wrong screen size, and each request to an outside host except Google Fonts.

The script puts the page in the same frame that the claude.ai artifact host adds, so the screenshots show the published page. The first run needs `npx playwright install chromium`.

## Publish the docs site

The live docs site is the claude.ai artifact [VSA on Web Awesome](https://claude.ai/artifact/2DLUahWMpZMHyBMtu8EGDH). Keep it current: publish it again after each change to `vsa/` that a reader can see.

1. Run `node vsa/scripts/build-artifact.mjs`. It writes `vsa/dist/vsa-design.html`. Git ignores this file.
2. Publish that file with the Artifact tool, with `url` set to `https://claude.ai/artifact/2DLUahWMpZMHyBMtu8EGDH`. Do not publish without `url`, because that makes a new artifact with a new link.
3. If the tool refuses because this session did not read the artifact, read it with `action: "read"` first. Then publish again.

The script uses only local files. It puts these items into one HTML file:

| Item | Source |
|---|---|
| All CSS, with its imports | `vsa/theme/`, `vsa/vendor/webawesome/styles/` |
| All components, bundled with esbuild | `vsa/vendor/webawesome/`, `vsa/components/` |
| `marked` and `highlight.js` | `vsa/vendor/` |
| The docs pages, the icons and the two API manifests | `vsa/docs/`, `vsa/vendor/webawesome/icons/` (only the icons that a page names, served by `vsa/scripts/artifact-icons.js`), the two `custom-elements.json` files |
| The Web Awesome component docs pages. Each component page and the gallery show their examples live | `packages/webawesome/docs/docs/components/`, our source |

The only outside link is Google Fonts. The script stops if the page links any other outside file.

## Change our source

1. If the change is a system change, write its decision record first (see "Rules").
2. Change `packages/webawesome/src`. Follow `packages/webawesome/CLAUDE.md`.
3. In `packages/webawesome/`, run the tests of the component: `npm run test:component -- --group <name>`.
4. Run `node vsa/scripts/vendor-webawesome.mjs`. It builds the source and copies the runtime files to `vsa/vendor/webawesome`.
5. Update the skills (see "Update the skills").
6. If the change adds or renames a token, compare `vsa/theme/theme.css` with `styles/themes/default.css`.
7. Run the checks in "Verify a change".
