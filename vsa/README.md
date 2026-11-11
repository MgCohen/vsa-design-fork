# VSA Design

VSA Design is the design system of VSA apps. Its source is in `packages/webawesome/`: it starts from Web Awesome 3.14.0 (MIT), and we change it step by step. This `vsa/` folder holds our style (a named theme, a palette and the looks), our own components, the build of our source, the docs site and the decisions.

See [decisions/](decisions/) for the reasons (`0001` our source, `0002` theme and palette, `0003` dial), and [DESIGN.md](DESIGN.md) for the brief for agents.

## Files

| Path | Content |
|---|---|
| `theme/palette.css` | `.wa-palette-vsa`: the hue tints. The only file with hex colors |
| `theme/theme.css` | `.wa-theme-vsa`: roles to tints for light and dark, fonts, scale controls, shadows |
| `theme/looks.css` | Project tokens (`--vsa-*`), and the raised and carved looks with documented `::part()` rules |
| `setup.js` | Registers the vendored icons as the default icon library. Load it before the Web Awesome loader |
| `vendor/` | Our build of Web Awesome (`vendor/webawesome`, made by `scripts/vendor-webawesome.mjs`), the icons, `marked` and `highlight.js`. Do not edit these files |
| `components/vsa-<name>.js` | A VSA component: a custom element with shadow DOM, plain JavaScript, no build. Now: `vsa-table` |
| `components/custom-elements.json` | The API of the VSA components, in the Custom Elements Manifest format. The site makes the API tables from it |
| `theme/code.css` | The code block: project tokens for code colors, and the dark IDE look of `pre.vsa-code` |
| `site/index.html` | The docs site, made from the system: `<wa-page>` with the menu in a drawer on mobile, foundations, one page for each component, light and dark |
| `scripts/build-artifact.mjs` | Makes the docs site into one HTML file for the live artifact. See "Publish the docs site" in the root `AGENTS.md` |
| `scripts/check.mjs` | Checks our files against the Web Awesome design rules and our rules |
| `scripts/screenshots.mjs` | Screenshots of the published page: mobile and desktop, light and dark |
| `docs/index.json` | The menu: the foundations pages and the components that have a usage page |
| `decisions/` | Design decisions |
| `DESIGN.md` | The design brief for agents, in the form that Web Awesome recommends |
| `docs/overview.md` | The first page |
| `docs/foundations/*.md` | Color, typography, spacing, radius, elevation, motion, code |
| `docs/components/<name>.md` | The usage page of one component: when to use it, variants as live examples, VSA tokens |

## How the site works

- The site has no build. It reads the Markdown files in the browser.
- A code block with the language `html preview` shows the live HTML and its code.
- Each other code block is dark, as in an IDE, with highlight.js colors. Its text scales down until the longest line fits, to 8 px minimum.
- A code block with the language `tokens <regex>` shows a table of the matching tokens. Each row shows the path to the source value, and the light and dark values.
- The API tables (attributes, slots, events, parts, CSS properties, states) come from the Web Awesome `custom-elements.json` and from `components/custom-elements.json`. Each component gets an API page, also with no usage page.

## How the site loads

1. `theme/fonts.css`: the font files from Google Fonts.
2. `vendor/webawesome/styles/themes/default.css`, `utilities.css` and `native.css`: the Web Awesome defaults, the utilities and the native element styles, in cascade layers.
3. `theme/palette.css`, `theme/theme.css`, `theme/looks.css`, `theme/code.css`: the VSA palette, theme and looks, in the Web Awesome cascade layers.
4. `setup.js`: the icon library.
5. `vendor/webawesome/webawesome.loader.js`: it loads each component when the page uses it.
6. `components/vsa-table.js`: it defines `<vsa-table>`.
7. `vendor/marked` and `vendor/highlight.js`: Markdown to HTML, and the code colors.

The published page is one file. `scripts/build-artifact.mjs` bundles the components and puts the CSS, the docs and the icons in it.

## Add a usage page

1. Write `docs/components/<name>.md`. Use `<name>` without `wa-`, for example `switch`.
2. Start with "When to use it". Then write "Look", "Variants" and "VSA tokens and looks".
3. Add the component to `components` in `docs/index.json`.

## Add a VSA component

Do this only for behavior that no Web Awesome component has. For a new look on a Web Awesome component, make a house class in `theme/looks.css` instead, as the dial does. [Table](site/index.html#/components/table) is the sample.

1. Write `components/vsa-<name>.js`: a custom element with shadow DOM. Use the API names of the HTML element or the Web Awesome component that is nearest.
2. Read the `--wa-*` tokens, as a Web Awesome component does. Read a project token only for a look that Web Awesome has no token for, for example `--vsa-shadow-carve`.
3. Give each color and size a custom property on `:host`, with the name that the nearest Web Awesome component uses, for example `--indicator-color` and `--track-width`. Use the sizes `s`, `m` and `l`.
4. Add the API to `components/custom-elements.json`.
5. Load the file in `site/index.html`, and add the component to the gallery.
6. Write its usage page, as for a Web Awesome component.

## Open questions

- Two-way binding in Blazor needs a thin Razor wrapper for each form control. Nobody has tested Blazor yet.
- The badge default color is the brand color. Decide if the VSA default is neutral.
- The dots have no Web Awesome component. Write them as a VSA component, as the dial.
- The Runner reference shows a ring with more than one color: done, pending and failed. Decide if it is a `segments` API of the dial or a separate component.

## Run it

Serve the repo root with any static web server. Then open `/vsa/site/index.html`. The site reads the Web Awesome docs pages from `packages/webawesome/`, so the server must include that folder.
