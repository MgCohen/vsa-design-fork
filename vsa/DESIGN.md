# Design system: VSA on Web Awesome

**Foundation.** Our own build of Web Awesome 3.14.0, vendored in `vendor/webawesome/` (decision `0005`). `setup.js` registers our vendored icons, then the Web Awesome loader runs. No CDN, no Font Awesome kit. Google Fonts is the one outside link.

**Theme.** The VSA style is a Web Awesome theme and palette (decision `0006`). On `<html>`: `wa-theme-vsa wa-palette-vsa wa-brand-orange`, and `wa-light` or `wa-dark` from a System / Light / Dark switch.

| Level | File | Cascade layer | Holds |
|---|---|---|---|
| Palette | `theme/palette.css`, `.wa-palette-vsa` | `wa-color-palette` | 11 tints for gray, orange, green, yellow, red. The only hex colors |
| Brand | `wa-brand-orange` on `<html>` | `wa-color-variant` | Which hue is the brand |
| Theme | `theme/theme.css`, `.wa-theme-vsa` | `wa-theme` | Roles to role tints, light and dark, fonts, scale controls, shadows |
| Looks | `theme/looks.css`, `theme/code.css` | `wa-theme`, `wa-theme-dimension` | Project tokens and documented `::part()` rules |
| App variation | The app's own stylesheet | No layer | The app's values, in the three scopes: both schemes, light, dark |

**How to change it.** Replace values, keep the structure. For which kind of change goes where, use the Web Awesome design skill: `theming.md` (palette, brand, roles, light and dark), `your-design-system.md` sections 2 and 3 (where a customization lives, how to extend), and `composition.md` "Styling components" (one component). The table above gives our file for each level.

**Project tokens.** `--vsa-*` tokens are only for ideas that Web Awesome has no token for: the carved, knob, press, glow, dial and hole shadows (`--vsa-shadow-*`), the surface gradients (`--vsa-gradient-*`), the letter spacing (`--vsa-letter-spacing-*`), the code colors (`--vsa-color-code-*`) and the smallest code size (`--vsa-font-size-code-min`). The raised look uses `--wa-shadow-m` and `--wa-shadow-s`. Do not make a `--vsa-*` name for an idea that a `--wa-*` token has. The page background is `--wa-color-surface-default`, and the card surface is `--wa-color-surface-raised`.

**Looks.** Each surface is raised or carved. The looks are for the `wa-*` components only, not for native buttons and inputs. `theme/looks.css` gives the looks to Web Awesome components with documented parts and states, in the `wa-theme-dimension` layer, as Web Awesome's own Awesome theme does:

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
| `<vsa-dial>` | Own element | One value of a whole, the main number of a card | `components/vsa-dial.js` |
| `wa-progress-ring.vsa-dial` | House class on `wa-progress-ring` (proposed in decision `0008`: it can replace `<vsa-dial>`) | The same as `<vsa-dial>`, without the glow | `theme/looks.css` |
| `<vsa-table>` | Own element around a native `<table>`: Web Awesome has no narrow table layout | Each data table. In a narrow container, each row shows as a block | `components/vsa-table.js` |
| `pre.vsa-code` | `<pre>` | A code sample, dark in both schemes | `theme/code.css` |

**Conventions.** Main action: `variant="brand"`, one on each screen. Sizes: `s`, `m`, `l`. Status colors: `variant="success"`, `"warning"`, `"danger"`. An own element uses the `vsa-` prefix, reads `--wa-*` tokens, and uses the custom property names of the nearest Web Awesome component.

**Don't.**
- Do not use `size="small"`, `"medium"` or `"large"`. They are deprecated. Use `s`, `m`, `l`.
- Do not style `::part(base)`. It is deprecated. Use the part names on the component page.
- Do not put a hex color outside `theme/palette.css`, or a px size outside the theme files. Use a token. One exception: the 1 px of the visually hidden pattern in `components/vsa-table.js`.
- In `vsa/`, do not set a `--wa-*` token outside `theme/theme.css` and `theme/palette.css`. An app sets its own values in its own stylesheet (see the table above).
- Do not load a file from a CDN. Add it to `vendor/`.

**Verify.** Run `node vsa/scripts/check.mjs`. Then check each visible change on mobile and on desktop, in light and in dark: run `node vsa/scripts/build-artifact.mjs`, then `node vsa/scripts/screenshots.mjs`, and look at the screenshots. See "Verify a change" in the root `AGENTS.md`.
