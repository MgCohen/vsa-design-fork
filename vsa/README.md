# VSA Design

VSA Design is the design system of VSA apps. It is a fork of Web Awesome 3.14.0 (MIT). The Web Awesome source is in `packages/`, unchanged so far. Our work is in this `vsa/` folder: the theme, the looks, our own components and the docs site.

See [decisions/0005-fork-web-awesome.md](decisions/0005-fork-web-awesome.md) for the reason for the fork, and [DESIGN.md](DESIGN.md) for the brief for agents.

## Files

| Path | Content |
|---|---|
| `theme/vsa.css` | The theme layer: the only place for `--wa-*` overrides, in the three blocks that Web Awesome recommends. It also sets the project tokens (`--vsa-*`) for the raised and carved looks. Then the looks, with `::part()` |
| `components/vsa-<name>.js` | A VSA component: a custom element with shadow DOM, plain JavaScript, no build. Now: `vsa-dial` |
| `components/custom-elements.json` | The API of the VSA components, in the Custom Elements Manifest format. The site makes the API tables from it |
| `theme/code.css` | The code block: project tokens for code colors, and the dark IDE look of `pre.vsa-code` |
| `site/index.html` | The docs site: side menu, foundations, one page for each component, light and dark |
| `docs/index.json` | The menu: the foundations pages and the components that have a usage page |
| `decisions/` | Design decisions. `0005` is the fork |
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

1. `theme/fonts.css`: the font files.
2. Web Awesome `styles/themes/default.css` and `styles/utilities.css` from jsDelivr: their default tokens and the utilities, in cascade layers.
3. `theme/vsa.css`: not in a layer, so it wins over all Web Awesome layers.
4. `theme/code.css`: the code block.
5. `components/vsa-dial.js`: it defines `<vsa-dial>`.
6. Web Awesome `webawesome.loader.js` from jsDelivr: it loads each component when the page uses it.
7. `marked` 11.2.0 from jsDelivr: it changes Markdown to HTML.
8. `highlight.js` 11.9.0 from cdnjs: it gives the code colors.

The site still uses the prebuilt Web Awesome files from the CDN, not the source in this repo.

## Add a usage page

1. Write `docs/components/<name>.md`. Use `<name>` without `wa-`, for example `switch`.
2. Start with "When to use it". Then write "Look", "Variants" and "VSA tokens and looks".
3. Add the component to `components` in `docs/index.json`.

## Add a VSA component

Do this only for a component that Web Awesome does not have. [Dial](site/index.html#/components/dial) is the sample.

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
- The dots have no Web Awesome component. Write them as a VSA component, as the dial.
- The Runner reference shows a ring with more than one color: done, pending and failed. Decide if it is a `segments` API of the dial or a separate component.

## Run it

Serve the `vsa/` folder with any static web server. Then open `/site/index.html`.
