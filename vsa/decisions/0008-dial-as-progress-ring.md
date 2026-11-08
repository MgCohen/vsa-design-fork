# 0008: The dial as a styled wa-progress-ring

**Status:** proposed. The choice waits for a look at the side-by-side test on the Dial page.

**Proposal:** The dial becomes `<wa-progress-ring class="vsa-dial">`, a house class in `theme/looks.css`, and we delete the own element `vsa-dial`. Web Awesome then gives the behavior: the value, the progressbar role, the label and the upstream fixes.

| Look | `vsa-dial` (own element) | `wa-progress-ring.vsa-dial` (house class) |
|---|---|---|
| Deep carved channel | Yes | Yes, on `::part(progress-ring)` |
| Raised center | Yes | Yes, on `::part(label)` |
| Status colors | `variant` attribute | Web Awesome variant classes: `wa-success`, `wa-warning`, `wa-danger` |
| Small size | `size="s"` | Class `vsa-dial-s` |
| Glow on the indicator | Yes | No. The SVG viewport clips a filter, and the ring has no other hook |
| Ends of the indicator | Flat | Round (`stroke-linecap: round` in Web Awesome) |

## Reason

The Web Awesome design skill: make a new element only for new behavior. The dial has the behavior of `wa-progress-ring`, and only its look differs.

## Cost

- No glow, and round ends, unless we accept a change to the component source.
- Every page that uses `<vsa-dial>` changes to the new markup.
