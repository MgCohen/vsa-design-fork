# Design system: VSA on Web Awesome

**Foundation.** Web Awesome 3.14.0 from the CDN loader, version pinned. On `<html>`: `wa-theme-default wa-palette-default`, and `wa-light` or `wa-dark` from a System / Light / Dark switch. No Font Awesome Pro kit.

**Theme layer.** All `--wa-*` overrides are in `theme/vsa.css`. Add there. Do not set `--wa-*` tokens in another file.

**Project tokens.** `--vsa-*` tokens are only for ideas that Web Awesome has no token for: the carved, knob, press, glow, dial and hole shadows (`--vsa-shadow-*`), the surface gradients (`--vsa-gradient-*`), the letter spacing (`--vsa-letter-spacing-*`), the code colors (`--vsa-color-code-*`) and the smallest code size (`--vsa-font-size-code-min`). The raised look uses `--wa-shadow-m` and `--wa-shadow-s`. Do not make a `--vsa-*` name for an idea that a `--wa-*` token has.

**Looks.** Each surface is raised or carved. `theme/vsa.css` gives the looks to Web Awesome components with documented parts and states:

| Look | Where |
|---|---|
| Raised: `--wa-shadow-m`, `--vsa-gradient-surface` | `wa-button` (not plain or outlined; only neutral buttons get the surface, the other variants keep their colors), `wa-card` and `wa-details` (the default `outlined` appearance only) |
| Carved: `--vsa-shadow-carve`, `--wa-color-surface-lowered` | `wa-input`, `wa-textarea`, `wa-select`, switch track, checkbox, radio, slider track, progress bar |
| Knob: `--vsa-gradient-knob`, `--vsa-shadow-knob` | Switch thumb, slider thumb |

**Layout.** Use `wa-stack`, `wa-cluster`, `wa-grid` and `wa-gap-*` for layout, and `--wa-space-*` for each gap. Do not write flex or grid by hand. For a full page, use `<wa-page>`: it moves the `navigation` slot into a drawer below `mobile-breakpoint`. Do not write media queries for the nav or the toggle.

**Responsive.** Web Awesome has no breakpoint tokens. A layout adapts to its space:

| Need | Use |
|---|---|
| A page with a sidebar on desktop and a drawer on mobile | `<wa-page mobile-breakpoint="…">`, the `navigation` slot, `wa-page[view='mobile']` for page-specific changes |
| Cards or tiles that wrap | `wa-grid` with `--min-column-size` |
| A row that wraps | `wa-cluster` |
| A data table | `<vsa-table>`: rows become blocks in a narrow container |
| A component | Its own size: `em` units, `size="s"`, `"m"`, `"l"` |

**Docs site.** `site/index.html` uses the system: `<wa-page>` for the layout, Web Awesome native styles for text and tables, and `wa-*` and `vsa-*` elements for each control. A change to the system shows on the site. Do not add a hand-made control to the site.

**Vocabulary.** Use these before you make something new.

| Name | Built from | Use for | Defined in |
|---|---|---|---|
| `<vsa-dial>` | Own element: Web Awesome has no dial | One value of a whole, the main number of a card | `components/vsa-dial.js` |
| `<vsa-table>` | Own element around a native `<table>`: Web Awesome has no narrow table layout | Each data table. In a narrow container, each row shows as a block | `components/vsa-table.js` |
| `pre.vsa-code` | `<pre>` | A code sample, dark in both schemes | `theme/code.css` |

**Conventions.** Main action: `variant="brand"`, one on each screen. Sizes: `s`, `m`, `l`. Status colors: `variant="success"`, `"warning"`, `"danger"`. An own element uses the `vsa-` prefix, reads `--wa-*` tokens, and uses the custom property names of the nearest Web Awesome component.

**Don't.**
- Do not use `size="small"`, `"medium"` or `"large"`. They are deprecated. Use `s`, `m`, `l`.
- Do not style `::part(base)`. It is deprecated. Use the part names on the component page.
- Do not put a hex color or a px size outside `theme/vsa.css` and `theme/code.css`. Use a token. One exception: the 1 px of the visually hidden pattern in `components/vsa-table.js`.

**Verify.** Check each change on mobile and on desktop, in light and in dark. Run `node vsa/scripts/build-artifact.mjs`, then `node vsa/scripts/screenshots.mjs`, and look at the screenshots. See "Verify a change" in the root `AGENTS.md`.
