# 0002: Our style is a named theme over the default theme

**Decision:** The VSA style is a named Web Awesome theme (`wa-theme-vsa`) with its own palette, a brand class and looks. It sits over the default theme of our source, the same way that the Web Awesome themes Awesome and Shoelace do. The VSA theme sets only the tokens that differ from the default theme. Each other token, including each size formula, comes from the default theme.

```
themes/default.css          the default theme and the ground: all tokens and formulas, applies with no class
   ↑ over it
vsa/theme/theme.css         .wa-theme-vsa: only the values that differ
   ↑ over it
app stylesheet              no cascade layer: the values of one app
```

On `<html>`: `wa-theme-vsa wa-palette-vsa wa-brand-orange` plus `wa-light` or `wa-dark`.

| Level | File | Cascade layer | Holds |
|---|---|---|---|
| Default theme | `packages/webawesome/src/styles/themes/default.css` | `wa-theme` | All tokens and the size formulas. Selectors `:where(:root)`, `.wa-light`, `.wa-dark` |
| Palette | `vsa/theme/palette.css` | `wa-color-palette` | 11 tints for gray, orange, green, yellow and red. The other hues come from the default palette. The only hex colors |
| Brand | `wa-brand-orange` on `<html>` | `wa-color-variant` | Which hue is the brand |
| Theme | `vsa/theme/theme.css` | `wa-theme` | Roles to tints for light and dark, fonts, scale controls, shadows |
| Looks | `vsa/theme/looks.css` | `wa-theme` (tokens), `wa-theme-dimension` (rules) | Project tokens, and documented `::part()` rules for the raised and carved looks. The Awesome theme also puts its component looks in `wa-theme-dimension` |
| Code block | `vsa/theme/code.css` | `wa-theme`, `wa-theme-dimension` | The code colors and the look of `pre.vsa-code` |
| App variation | The app stylesheet | No layer | The values of one app, in three scopes: both schemes, light, dark. A stylesheet with no layer wins over each Web Awesome layer, also `wa-theme-overrides` |

## Rules

- Set a token in `theme.css` only if its value differs from the default theme. Status: `theme.css` sets 23 values that are the same as the default theme, for example `--wa-color-text-normal`. The review of `theme.css` deletes them.
- A role refers to a role tint, for example `--wa-color-surface-lowered: var(--wa-color-neutral-80)`. It never refers to a hue or a hex value. Then `wa-brand-*` and `wa-neutral-*` change the theme.
- Sizes use the formulas of the default theme. The theme sets the scale controls: `--wa-font-size-scale: 0.875` (14 px body) and `--wa-border-radius-scale: 2`. Space keeps the default scale.
- Two kinds of sizes are set directly:
  - The shadows. The raised look has several layers, and the shadow steps of the default theme have one. So the theme sets `--wa-shadow-s`, `-m` and `-l`, and the shadow scale controls have no effect. The drop layers read `--wa-color-shadow`.
  - The focus ring: `--wa-focus-ring-width` and `--wa-focus-ring-offset`.
- An app variation is not a new theme. It is a stylesheet with no cascade layer (`webawesome-design` skill, `your-design-system.md`, section 2).
- For how to make each kind of change, use the `webawesome-design` skill:
  - `theming.md`
  - `your-design-system.md`, sections 2 and 3
  - `composition.md`, "Styling components & CSS parts"

## Reason

A named theme over the default theme is how Web Awesome organizes its own themes. With the same structure, each Web Awesome control works on our style: `wa-brand-*`, `wa-invert`, the scale controls and palette changes. A theme that sets only the differences shows clearly what VSA changes, and it copies no formula.

## Cost

- The looks use `:state(checked)` on `wa-switch`. The switch sets that state (`switch.ts`), but its reference does not list it.
- A change to a default token that the VSA theme does not set also changes the VSA style.

## Non-goals

- No change to the values of the default theme now. Reason: we change only the VSA theme. The default theme can change later, with its own decision record.
