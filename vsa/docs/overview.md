# VSA Design System

The VSA Design System gives VSA apps one look. It uses the Web Awesome 3.14.0 components and the VSA tokens and looks.

## How the parts connect

Each step reads only the steps before it. A change in an early step changes all the later steps.

<div class="wa-grid wa-gap-s" style="--min-column-size: 12rem">
  <wa-card>
    <div class="wa-stack wa-gap-2xs">
      <wa-badge variant="brand" appearance="filled">Step 1</wa-badge>
      <a href="#/tokens/theme"><strong>Theme layer</strong></a>
      <span class="wa-caption-s">--wa-* values, light and dark</span>
      <code>theme/vsa.css</code>
    </div>
  </wa-card>
  <wa-card>
    <div class="wa-stack wa-gap-2xs">
      <wa-badge variant="success" appearance="filled">Step 1</wa-badge>
      <a href="#/tokens/project"><strong>Project tokens</strong></a>
      <span class="wa-caption-s">Only new ideas</span>
      <code>--vsa-*</code>
    </div>
  </wa-card>
  <wa-card>
    <div class="wa-stack wa-gap-2xs">
      <wa-badge variant="brand" appearance="filled">Step 2</wa-badge>
      <a href="#/foundations/elevation"><strong>Looks</strong></a>
      <span class="wa-caption-s">Raised, carved, knob</span>
      <code>::part()</code>
    </div>
  </wa-card>
  <wa-card>
    <div class="wa-stack wa-gap-2xs">
      <wa-badge variant="neutral" appearance="filled">Step 3</wa-badge>
      <a href="#/gallery"><strong>Web Awesome components</strong></a>
      <span class="wa-caption-s">73, styled by the theme</span>
      <code>&lt;wa-*&gt;</code>
    </div>
  </wa-card>
  <wa-card>
    <div class="wa-stack wa-gap-2xs">
      <wa-badge variant="success" appearance="filled">Step 3</wa-badge>
      <a href="#/components/dial"><strong>VSA components</strong></a>
      <span class="wa-caption-s">Only where Web Awesome has none</span>
      <code>&lt;vsa-*&gt;</code>
    </div>
  </wa-card>
  <wa-card>
    <div class="wa-stack wa-gap-2xs">
      <wa-badge variant="neutral" appearance="filled">Step 4</wa-badge>
      <strong>Molecules, pages</strong>
      <span class="wa-caption-s">Planned</span>
      <code>slots</code>
    </div>
  </wa-card>
</div>

| Link | What it adds |
|---|---|
| Theme layer → Components | Each component reads the `--wa-*` tokens. A new `--wa-color-brand-fill-loud` changes each brand button, switch and slider |
| Project tokens → Looks | A shape that tokens cannot give, with `::part()`. `--vsa-shadow-carve` goes on the switch track |
| Components → Molecules | Composition. A molecule puts components into the slots of other components |

## Map

| Section | Pages | Use it to |
|---|---|---|
| [Gallery](#/gallery) | One example of each component | See the look of the whole system |
| Foundations | [Color](#/foundations/color), [Typography](#/foundations/typography), [Spacing](#/foundations/spacing), [Radius](#/foundations/radius), [Elevation](#/foundations/elevation), [Motion](#/foundations/motion) | Select a token for a purpose |
| Tokens | [Theme layer](#/tokens/theme), [Project tokens](#/tokens/project) | See all tokens that the VSA theme sets, with light and dark values |
| Components | One page for each component, for example [Switch](#/components/switch) and [Dial](#/components/dial) | Use a component: variants, slots, events, API |

## Important pages

- [Switch](#/components/switch): the sample usage page of a Web Awesome component. Each new usage page uses the same sections.
- [Dial](#/components/dial): the sample VSA component. A VSA component reads the `--wa-*` tokens, as a Web Awesome component does.
- [Elevation](#/foundations/elevation): the raised and carved looks, and where `::part()` applies them.
- [Theme layer](#/tokens/theme): all `--wa-*` values, and the Web Awesome defaults that the theme does not set.
