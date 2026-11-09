## When to use it

- Use a dial to show one value of a whole, for example the part of the tests that pass.
- Use a dial as the main number of a card or a page.
- If the value changes from one step to the next and has an end, use a progress bar.
- If the work has no known end, use a spinner.

## Look

A dial is `<wa-progress-ring>` with the house class `vsa-dial`. Web Awesome gives the behavior: the value, the label, the progressbar role and the animation. The class gives the VSA look: a deep carved channel, an indicator with a glow, and a raised center.

```html preview
<wa-progress-ring class="vsa-dial" value="72" label="Tests that pass">72%</wa-progress-ring>
```

Move the slider to change the value.

```html preview
<div class="wa-stack wa-gap-m dial-demo">
  <div class="wa-cluster wa-gap-l wa-align-items-center">
    <wa-progress-ring class="vsa-dial" value="72" label="Demo value">72%</wa-progress-ring>
    <wa-progress-ring class="vsa-dial vsa-dial-s" value="72" label="Demo value"></wa-progress-ring>
  </div>
  <wa-slider label="Value" min="0" max="100" value="72"></wa-slider>
</div>
<script>
  for (const box of document.querySelectorAll('.dial-demo')) {
    const slider = box.querySelector('wa-slider');
    slider.addEventListener('input', () => {
      for (const ring of box.querySelectorAll('wa-progress-ring')) ring.value = slider.value;
      box.querySelector('wa-progress-ring:not(.vsa-dial-s)').textContent = `${slider.value}%`;
    });
  }
</script>
```

## Variants

### Colors

Add a Web Awesome variant class for a state color. The default is the brand color.

```html preview
<wa-progress-ring class="vsa-dial wa-success" value="90" label="Done">90%</wa-progress-ring>
<wa-progress-ring class="vsa-dial wa-warning" value="45" label="Pending">45%</wa-progress-ring>
<wa-progress-ring class="vsa-dial wa-danger" value="20" label="Failed">20%</wa-progress-ring>
```

### Center content

The default slot is the center. Put a number, a word or an icon in it.

```html preview
<wa-progress-ring class="vsa-dial" value="98" label="Tests that pass">
  <div>131<br><small>of 133</small></div>
</wa-progress-ring>
```

### Sizes

The class `vsa-dial-s` is the small dial, with a shallow carve, for lists and table rows. All sizes follow the font size. For another size, set `--size`.

```html preview
<wa-progress-ring class="vsa-dial vsa-dial-s" value="60" label="Sync"></wa-progress-ring>
<wa-progress-ring class="vsa-dial" value="72" label="Tests">72%</wa-progress-ring>
<wa-progress-ring class="vsa-dial" value="72" label="Tests" style="--size: 12em">72%</wa-progress-ring>
```

## Accessibility

`wa-progress-ring` has the role `progressbar`, with its value. Always set `label`: screen readers read it with the value.

## Tokens and looks

The class is in `theme/looks.css`. It uses only the documented parts and properties of `wa-progress-ring`.

| Item | Value |
|---|---|
| Channel | The `progress-ring` part: `--wa-color-surface-lowered` and the deep carve `--vsa-shadow-dial`. The small dial uses `--vsa-shadow-carve` |
| Indicator | `--indicator-color` (default `--wa-color-brand-fill-loud`). A variant class sets it to the variant fill. The glow is the same color |
| Center | The `label` part: `--vsa-gradient-hole` and `--vsa-shadow-hole`. The small dial uses `--wa-shadow-s` |

The glow needs room inside the ring. Keep `--track-width` wider than `--indicator-width`: the class sets 16 % and 10 % of `--size`.
