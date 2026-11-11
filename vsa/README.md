# VSA Design

VSA Design is the design system of VSA apps. It owns a build of Web Awesome 3.14.0 (MIT). The Web Awesome source is in `packages/`, and we do not change its components. Our work is in this `vsa/` folder: a Web Awesome theme and palette, the looks, our own components, the vendored files and the docs site.

See [decisions/](decisions/) for the reasons (`0005` own build, `0006` theme and palette, `0007` Windows build fix, `0008` dial as a progress ring), and [DESIGN.md](DESIGN.md) for the brief for agents.

## Files

| Path | Content |
|---|---|
| `theme/palette.css` | `.wa-palette-vsa`: the hue tints. The only file with hex colors |
| `theme/theme.css` | `.wa-theme-vsa`: roles to tints for light and dark, fonts, scale controls, shadows |
| `theme/looks.css` | Project tokens (`--vsa-*`), and the raised and carved looks with documented `::part()` rules |
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
| `reference/custom-design/` | Our first design system, before the fork: tokens, atoms, gallery and decisions `0001` to `0004`. Use it as a reference for the look and the gallery |
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
4. `vendor/webawesome/webawesome.loader.js`: it loads each component when the page uses it. The icons come from `vendor/webawesome/icons/svgs/` (decision `0009`).
5. `components/vsa-table.js`: it defines `<vsa-table>`.
6. `vendor/marked` and `vendor/highlight.js`: Markdown to HTML, and the code colors.

The published page is one file. `scripts/artifact-icons.js` gives it the icons with no requests, because the claude.ai frame blocks them. `scripts/build-artifact.mjs` bundles the components and puts the CSS, the docs and the icons in it.

## Use it in an app

1. Serve the `vsa/` folder, or copy `theme/` and `vendor/webawesome/` into the app.
2. Load the stylesheets in the order of "How the site loads", steps 1 to 3.
3. Load the loader. The icons need no setting:

```html
<script type="module" src="/vsa/vendor/webawesome/webawesome.loader.js" data-webawesome="/vsa/vendor/webawesome"></script>
```

4. If the app needs a different icon folder, add `data-webawesome-icons="<folder>"` to the loader tag.

Use only this Web Awesome build. Do not also load Web Awesome from npm or a CDN.

## Add a usage page

1. Write `docs/components/<name>.md`. Use `<name>` without `wa-`, for example `switch`.
2. Start with "When to use it". Then write "Look", "Variants" and "Tokens and looks".
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

- The site loads the prebuilt Web Awesome 3.14.0 files from the CDN. Change it to the files that this repo builds.
- Two-way binding in Blazor needs a thin Razor wrapper for each form control. Nobody has tested Blazor yet.
- The badge default color is the brand color. Decide if the VSA default is neutral.
- The dots have no Web Awesome component. Write them as a VSA component, as the table.
- The Runner reference shows a ring with more than one color: done, pending and failed. Decide if it is a `segments` API of the dial or a separate component.

## Run it

Serve the `vsa/` folder with any static web server. Then open `/site/index.html`.
