# AGENTS.md

Instructions for AI coding agents (and humans) that work in this repository. This file is model-agnostic.

## Project

VSA Design is the design system of VSA apps. It owns a build of Web Awesome (MIT) from the `v3.14.0` release, with the source unchanged. Our style is a Web Awesome theme and palette, and each app adjusts it the Web Awesome way. See `vsa/decisions/0005-fork-web-awesome.md` and `0006-theme-and-palette.md`.

| Path | Content | Owner |
|---|---|---|
| `packages/webawesome/` | The Web Awesome source: components, themes, build, tests. We build it, but we do not change it without a decision record | Upstream, unchanged |
| `vsa/` | Our work: the theme, the looks, `vsa-*` components, the docs site, decisions. See `vsa/README.md` | Us |
| `vsa/DESIGN.md` | The design brief: the vocabulary, the conventions, the don'ts | Us |
| `.claude/skills/` | The Web Awesome agent skills, `webawesome` and `webawesome-design` | Upstream, copied |

## Read first

1. `vsa/DESIGN.md`. It has priority over the skills. The design skill also says that the project brief comes first.
2. The skill for the task:
   - `webawesome`: the API of one component, for example its attributes, slots, events and parts.
   - `webawesome-design`: layout, theming, tokens and composition.
3. `packages/webawesome/CLAUDE.md`, if you change a Web Awesome component.

An agent that does not load skills by itself can read the files: `.claude/skills/<skill>/SKILL.md`, then the files in its `references/` folder.

## Rules

- Put hex colors only in `vsa/theme/palette.css`. A role in `vsa/theme/theme.css` refers to a palette tint.
- Set `--wa-*` tokens only in `vsa/theme/theme.css`, and sizes only through the scale controls. See `0006`.
- Do not change `packages/webawesome/src` without a decision record.
- Make a `--vsa-*` token only for an idea that Web Awesome has no token for.
- An own component uses the `vsa-` prefix, reads `--wa-*` tokens, and uses the custom property names of the nearest Web Awesome component.
- Use the sizes `s`, `m` and `l`. Do not use `::part(base)`.
- Use only the MIT core. Do not copy Pro components or Pro themes.
- Keep `LICENSE.md` and the Web Awesome copyright notice.

## Upstream

`origin` is this fork. `upstream` is `shoelace-style/webawesome`. The default branch is `vsa`.

1. Run `git fetch upstream --tags`.
2. Merge only the fixes or the release that we want into `vsa`.
3. Update the skills to the same version, as described in the next section.

## Update the skills

The skills must have the same version as the Web Awesome code in this repo.

- **Before the first build:** copy `dist-cdn/skills/` of the release from the CDN, for example `https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.14.0/dist-cdn/skills/`.
- **After the build works:** run `npm run build` in `packages/webawesome/`, then copy `packages/webawesome/dist/skills/webawesome/` and `packages/webawesome/dist/skills/webawesome-design/` to `.claude/skills/`. Then the `webawesome` skill describes our components, not the upstream ones.

Do not edit the files in `.claude/skills/` by hand. The next update writes over them. Put our rules in `vsa/DESIGN.md`.

## Verify a change

Check each visible change on mobile and on desktop, in light and in dark. A change that looks correct on one screen size can break the other.

1. Run `node vsa/scripts/check.mjs`. It checks the Web Awesome design rules and our rules: hex colors only in the palette, `--wa-*` tokens only in the theme, no px, no `::part(base)`, no visual host rules, no hand-written flex or grid, no outside links. Fix each finding.
2. Run `node vsa/scripts/build-artifact.mjs`.
3. Run `node vsa/scripts/screenshots.mjs`. Add hash routes to check other pages, for example `node vsa/scripts/screenshots.mjs /components/table`.
4. Look at the screenshots in `vsa/dist/screenshots/`: mobile (390 px) and desktop (1440 px), light and dark, for each page.
5. If the script reports a problem, fix it. It reports console errors, page errors, a page that is wider than the screen, a wrong screen size, and each request to an outside host except Google Fonts.

The script puts the page in the same frame that the claude.ai artifact host adds, so the screenshots show the published page. The first run needs `npx playwright install chromium`.

## Publish the docs site

The live docs site is the claude.ai artifact [VSA on Web Awesome](https://claude.ai/artifact/2DLUahWMpZMHyBMtu8EGDH). Keep it current: publish it again after each change to `vsa/` that a reader can see.

1. Run `node vsa/scripts/build-artifact.mjs`. It writes `vsa/dist/vsa-design.html`. Git ignores this file.
2. Publish that file with the Artifact tool, with `url` set to `https://claude.ai/artifact/2DLUahWMpZMHyBMtu8EGDH`. Do not publish without `url`, because that makes a new artifact with a new link.
3. If the tool refuses because this session did not read the artifact, read it with `action: "read"` first. Then publish again.

The script needs Node 18 or later and access to `cdn.jsdelivr.net`. It puts these items into one HTML file:

| Item | Source |
|---|---|
| Our CSS and `vsa-dial.js` | `vsa/theme/`, `vsa/components/` |
| The Web Awesome theme and utilities CSS | jsDelivr. An artifact page cannot load stylesheets from jsDelivr |
| The docs pages | `vsa/docs/`, as `window.VSA_FILES` |
| The two API manifests | `vsa/components/custom-elements.json`, and the Web Awesome manifest from jsDelivr |

The page still loads the Web Awesome components, `marked` and `highlight.js` from the CDN at run time, and the fonts from Google Fonts.
