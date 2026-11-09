# Theme and palette

The VSA look is a Web Awesome theme and palette. On `<html>`: `wa-theme-vsa wa-palette-vsa wa-brand-orange`, plus `wa-light` or `wa-dark`. See decision `0006`.

| File | Class | Cascade layer | Content |
|---|---|---|---|
| `theme/palette.css` | `.wa-palette-vsa` | `wa-color-palette` | 11 tints for gray, orange, green, yellow and red. The only file with hex colors |
| `theme/theme.css` | `.wa-theme-vsa` | `wa-theme` | Roles to tints for light and dark, fonts, scale controls, shadows, form controls and panels |
| `theme/looks.css` | `.wa-theme-vsa` | `wa-theme` and `wa-theme-dimension` | Project tokens and the raised and carved looks |

The theme has three blocks, with the same selector sets as Web Awesome's own themes: light, dark, and both schemes.

To change a value, use the Web Awesome design skill: `theming.md` for palette, brand and roles, and `your-design-system.md` sections 2 and 3 for where each change goes. For example, `wa-brand-red` on `<html>` makes each brand button, switch and slider red, and `--wa-border-radius-scale` changes every corner.

## Palette tints

```tokens ^--wa-color-(gray|orange|green|yellow|red)-\d\d$ @palette.css
```

## Theme tokens

```tokens ^--wa- @theme.css
```

## Web Awesome defaults that the theme does not set

These tokens keep their Web Awesome value. The font sizes and the radii follow the scale controls above.

```tokens ^--wa-(space-(3xs|2xs|xs|s|m|l|xl|2xl|3xl)|font-size-(2xs|xs|s|m|l|xl|2xl|3xl)|border-radius-[sml]|border-width-[sml]|border-style|line-height-expanded|transition-(normal|slow))$ @default.css
```
