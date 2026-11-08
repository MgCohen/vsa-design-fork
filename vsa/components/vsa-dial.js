// <vsa-dial>: a ring that shows progress, in a deep carved channel with a raised center.
// API like <wa-progress-ring> and <progress>: value, max, label. variant gives the color. size is s, m or l.
// Custom properties with the names of <wa-progress-ring>: --size, --track-width, --track-color, --indicator-color.
// Behavior of the WAI-ARIA progressbar role: aria-valuenow, aria-valuemin, aria-valuemax and an accessible name.
// Reads the Web Awesome tokens, and the project tokens for the carved and raised shadows.
const styles = `
:host {
  /* All sizes follow --size, and --size follows the font size, so the dial scales with the text. */
  --size: 8.5em;
  --track-width: calc(var(--size) * 0.1);
  --track-color: var(--wa-color-surface-lowered);
  --indicator-color: var(--wa-color-brand-fill-loud);
  --fill-inset: calc(var(--size) * 0.025); --hole-gap: calc(var(--size) * 0.05);
  --track-shadow: var(--vsa-shadow-dial);
  --hole-shadow: var(--vsa-shadow-hole);
  display: inline-grid; place-items: center; vertical-align: middle; position: relative; flex: none;
  width: var(--size); height: var(--size); border-radius: 50%;
  background: var(--track-color);
  font-family: var(--wa-font-family-body); color: var(--wa-color-text-normal);
}
:host([hidden]) { display: none; }
:host([size="s"]) {
  --size: 2.5em; --track-width: calc(var(--size) * 0.14); --fill-inset: 0em; --hole-gap: calc(var(--size) * 0.03);
  --track-shadow: var(--vsa-shadow-carve);
  --hole-shadow: var(--wa-shadow-s);
}
:host([size="l"]) { --size: 12em; }
:host([variant="success"]) { --indicator-color: var(--wa-color-success-fill-loud); }
:host([variant="warning"]) { --indicator-color: var(--wa-color-warning-fill-loud); }
:host([variant="danger"]) { --indicator-color: var(--wa-color-danger-fill-loud); }
:host::after {
  content: ""; position: absolute; inset: 0; border-radius: 50%; z-index: 1; pointer-events: none;
  box-shadow: var(--track-shadow);
}
.indicator {
  position: absolute; inset: var(--fill-inset); border-radius: 50%;
  background: conic-gradient(var(--indicator-color) calc(var(--percent, 0) * 1%), transparent 0);
  --mask: radial-gradient(circle, transparent calc(50% - var(--track-width) - var(--fill-inset)), black calc(50% - var(--track-width) - var(--fill-inset) + var(--size) * 0.004));
  -webkit-mask: var(--mask);
  mask: var(--mask);
  filter: drop-shadow(0 0 calc(var(--size) * 0.067) color-mix(in srgb, var(--indicator-color) 45%, transparent));
}
.hole {
  position: absolute; inset: calc(var(--track-width) + var(--hole-gap)); border-radius: 50%; z-index: 2;
  background: var(--vsa-gradient-hole); box-shadow: var(--hole-shadow);
}
.label {
  position: relative; z-index: 3; display: grid; place-items: center; text-align: center;
  font-size: calc(var(--size) * 0.17); font-weight: var(--wa-font-weight-semibold); line-height: var(--wa-line-height-condensed);
}
:host([size="s"]) .label { font-size: calc(var(--size) * 0.3); }
:host([size="s"]) .value { display: none; }
`;

class VsaDial extends HTMLElement {
  static observedAttributes = ['value', 'max', 'label'];
  #internals = this.attachInternals();
  #indicator;
  #fallback;
  #warned = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML =
      `<style>${styles}</style>` +
      '<span class="indicator" part="indicator"></span><span class="hole" part="hole"></span>' +
      '<span class="label" part="label"><slot><span class="value"></span></slot></span>';
    this.#indicator = this.shadowRoot.querySelector('.indicator');
    this.#fallback = this.shadowRoot.querySelector('.value');
    this.#internals.role = 'progressbar';
    this.#internals.ariaValueMin = '0';
  }

  connectedCallback() {
    this.#sync();
  }
  attributeChangedCallback() {
    this.#sync();
  }

  get value() {
    return Number(this.getAttribute('value')) || 0;
  }
  set value(number) {
    this.setAttribute('value', String(number));
  }
  get max() {
    return Number(this.getAttribute('max')) || 100;
  }
  set max(number) {
    this.setAttribute('max', String(number));
  }
  get label() {
    return this.getAttribute('label') || '';
  }
  set label(text) {
    this.setAttribute('label', text);
  }
  get variant() {
    return this.getAttribute('variant') || 'brand';
  }
  set variant(name) {
    this.setAttribute('variant', name);
  }
  get size() {
    return this.getAttribute('size') || 'm';
  }
  set size(name) {
    this.setAttribute('size', name);
  }

  #sync() {
    const percent = Math.min(100, Math.max(0, (this.value / this.max) * 100));
    this.#indicator.style.setProperty('--percent', String(percent));
    this.#fallback.textContent = `${Math.round(percent)}%`;
    this.#internals.ariaValueMax = String(this.max);
    this.#internals.ariaValueNow = String(Math.min(this.max, Math.max(0, this.value)));
    // A progressbar needs a name. Without label, use the center text, then a general name.
    const name = this.label || this.textContent.trim() || 'Progress';
    if (!this.label && !this.#warned) {
      console.warn('<vsa-dial> has no label. Set label, so that screen readers can name the dial.', this);
      this.#warned = true;
    }
    this.#internals.ariaLabel = name;
  }
}

customElements.define('vsa-dial', VsaDial);
