# 0006: Our style is a Web Awesome theme and palette

**Decision:** The VSA style is a Web Awesome palette (`.wa-palette-vsa`) and a Web Awesome theme (`.wa-theme-vsa`), made the same way as Web Awesome's own themes. We replace values. We do not change how Web Awesome organizes its tokens.

| Level | File | Cascade layer | Holds |
|---|---|---|---|
| Palette | `vsa/theme/palette.css` | `wa-color-palette` | 11 tints for each hue. The only file with hex colors |
| Brand | `wa-brand-orange` on `<html>` | `wa-color-variant` | Which hue is the brand |
| Theme | `vsa/theme/theme.css` | `wa-theme` | Roles to tints, light and dark, fonts, scale controls |
| Looks | `vsa/theme/looks.css` | `wa-theme` (tokens), `wa-theme-dimension` (rules) | Project tokens, and documented `::part()` rules for the raised and carved looks. Web Awesome's own Awesome theme puts its component looks in `wa-theme-dimension` too |
| Code block | `vsa/theme/code.css` | `wa-theme`, `wa-theme-dimension` | The code colors and the look of `pre.vsa-code` |
| App variation | The app's own stylesheet | No layer | The app's values, in the three scopes: both schemes, light, dark. A stylesheet with no layer wins over every Web Awesome layer, also `wa-theme-overrides`, which themes use |

On `<html>`: `wa-theme-vsa wa-palette-vsa wa-brand-orange` plus `wa-light` or `wa-dark`.

## Rules

- A role refers to a role tint, for example `--wa-color-surface-lowered: var(--wa-color-neutral-80)`, never to a hue or a hex value. Then `wa-brand-*` and `wa-neutral-*` change the theme.
- Sizes use the Web Awesome formulas. The theme sets only the scale controls: `--wa-font-size-scale: 0.875` (14 px body) and `--wa-border-radius-scale: 2`. Space keeps the Web Awesome scale.
- One exception: the shadows. The raised look has several layers, and Web Awesome's shadow steps have one. So the theme sets `--wa-shadow-s`, `-m` and `-l` directly, and the shadow scale controls (offset, blur, spread) have no effect. The drop layers read `--wa-color-shadow`.
- An app variation is not a new theme. It is a stylesheet with no cascade layer, as the Web Awesome design skill shows (`your-design-system.md`, section 2).
- For how to make each kind of change, use the Web Awesome design skill: `theming.md`, `your-design-system.md` sections 2 and 3, and `composition.md` "Styling components".

## Reason

This is how Web Awesome packages a complete look, for example the Awesome and Shoelace themes. With the same structure, every Web Awesome control works on our base: `wa-brand-*`, `wa-invert`, the scale controls and palette changes. Before, `vsa.css` held 147 hex values directly on the roles, outside any cascade layer. An app could not change the base without a fight over load order.

## Cost

- The looks use `:state(checked)` on `wa-switch`. The switch sets that state, but its reference does not list it. Check it at each Web Awesome update.

- The type and radius steps follow the Web Awesome ratios. Headings are larger, and the small text is 1 px smaller than before.
