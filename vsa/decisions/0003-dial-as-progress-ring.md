# 0003: The dial is a house class on wa-progress-ring

**Decision:** The dial is `<wa-progress-ring class="vsa-dial">`, a house class in `vsa/theme/looks.css`. Web Awesome gives the behavior: the value, the `progressbar` role, the label and the transition of the indicator. The house class gives only the VSA look.

```html
<wa-progress-ring class="vsa-dial" value="72" label="Tests that pass">72%</wa-progress-ring>
```

| Look | Made with |
|---|---|
| Deep carved channel | `::part(progress-ring)`: `--wa-color-surface-lowered` and `--vsa-shadow-dial` |
| Indicator and track | `--indicator-color`, `--indicator-width`, `--track-width`, `--track-color: transparent` |
| Glow on the indicator | `::part(indicator)`: a `drop-shadow` filter. The transparent track is wider than the indicator, so the indicator sits 3 % inside the SVG edge and the glow is not clipped |
| Raised center | `::part(label)`: `--vsa-gradient-hole` and `--vsa-shadow-hole` |
| Status colors | The Web Awesome variant classes `wa-success`, `wa-warning`, `wa-danger` |
| Small dial for lists and rows | The class `vsa-dial-s`: a shallow carve, no glow |
| Size | `--size` |

## Reason

The `webawesome-design` skill says: make a new element only for new behavior. The dial has the behavior of `wa-progress-ring`. Only its look is different, and documented parts and custom properties can give that look.

## Cost

- The indicator has round ends: `stroke-linecap: round` in `progress-ring.styles.ts`.

## Non-goals

- No own element `vsa-dial`. Reason: it has the same behavior as `wa-progress-ring`. An own element must write the value, the role, the label and the transition again, and keep them correct.
