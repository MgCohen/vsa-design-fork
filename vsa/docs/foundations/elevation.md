# Elevation

The VSA look has two shapes. Tokens give the shadow values. `theme/looks.css` applies them to Web Awesome components with `::part()`, because Web Awesome has no token for these places. A VSA component, for example the dial, reads them directly.

| Look | Shadow | Components |
|---|---|---|
| Raised: a surface over the canvas | `--wa-shadow-m` | Button, card, details |
| Carved: a channel cut into the surface | `--vsa-shadow-carve` | Input, select, textarea, switch track, checkbox, radio, slider track, progress bar |
| Deep carve: a wide round channel | `--vsa-shadow-dial` | Dial channel |
| Hole: a raised center in a channel | `--vsa-shadow-hole` | Dial center |
| Knob: a part that moves in a channel | `--vsa-shadow-knob` | Switch thumb, slider thumb |
| Pressed: a raised part that is down | `--vsa-shadow-press` | Button on press, switch track when on |

```html preview
<wa-button>Raised</wa-button>
<wa-input placeholder="Carved" style="width: 12rem"></wa-input>
<wa-switch checked aria-label="Knob"></wa-switch>
<vsa-dial value="72" label="Deep carve"></vsa-dial>
```

## Web Awesome shadows

The raised look uses the Web Awesome shadows: `--wa-shadow-m` for a surface, and `--wa-shadow-s` for a small part, for example the center of the small dial. Popups, dialogs and drawers use `--wa-shadow-l`, which has the value of `--wa-shadow-m`.

```tokens ^--wa-shadow-[sml]$
```

## VSA shadows

```tokens ^--vsa-shadow-
```
