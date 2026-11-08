## When to use it

- Use `<vsa-table>` around each data table that people can read on a phone, or in a narrow panel.
- Do not use it for a layout grid. For a layout, use `wa-grid`, `wa-stack` or `wa-cluster`.
- Do not use it for a table that people must compare across rows on a phone, for example a long list of numbers. Keep that table wide and let it scroll.

## Look

Put one native `<table>` in the element, with the column headers in `<thead>`. Web Awesome gives the table its look (`native.css`). In a wide container, it is a normal table. If the table is too wide, it scrolls.

```html preview
<vsa-table>
  <table>
    <thead><tr><th>Runner</th><th>Status</th><th>Last run</th></tr></thead>
    <tbody>
      <tr><td>build-01</td><td><wa-badge variant="success">Done</wa-badge></td><td>2 min ago</td></tr>
      <tr><td>build-02</td><td><wa-badge variant="warning">Pending</wa-badge></td><td>5 min ago</td></tr>
    </tbody>
  </table>
</vsa-table>
```

## Variants

### Narrow container

If the element is narrower than `stack-width` (600 by default), each row shows as a block. Each cell shows its column header above its value. The same table, in a narrow container:

```html preview
<div style="width: 18rem">
  <vsa-table>
    <table>
      <thead><tr><th>Runner</th><th>Status</th><th>Last run</th></tr></thead>
      <tbody>
        <tr><td>build-01</td><td><wa-badge variant="success">Done</wa-badge></td><td>2 min ago</td></tr>
        <tr><td>build-02</td><td><wa-badge variant="warning">Pending</wa-badge></td><td>5 min ago</td></tr>
      </tbody>
    </table>
  </vsa-table>
</div>
```

### Stack width

Set `stack-width` for a table that needs more or less width. The value is in px, and it is the width of the element, not of the screen.

```html
<vsa-table stack-width="800">
  <table>…</table>
</vsa-table>
```

## Accessibility

- The element gives each cell the text of its column header, as `data-label`. It reads the last header row and follows `colspan`.
- A block layout removes the table semantics in some browsers. So the element gives each part of the table its ARIA role: `table`, `rowgroup`, `row`, `columnheader` and `cell`.
- In the block layout, the header row is hidden on screen, but screen readers still read it.

## Style it

Select the block layout with the custom state `stacked`:

```css
vsa-table:state(stacked) td { padding-block: var(--wa-space-xs); }
```

## Tokens and looks

The table is a VSA component: `components/vsa-table.js`. Web Awesome has a look for native tables, but no table component and no narrow layout, so the project owns it.

| Item | Value |
|---|---|
| Table, header, cells | The Web Awesome native styles, and the page styles |
| Row in the block layout | `--wa-space-s` above and below, and a `--wa-color-surface-border` line under it |
| Cell label | `--wa-font-size-2xs`, `--wa-font-weight-semibold`, `--wa-color-text-quiet` |
