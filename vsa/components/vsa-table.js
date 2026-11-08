// <vsa-table>: a wrapper for a native <table> that stays readable in a narrow container.
// Web Awesome styles native tables (native.css), but has no table component and no narrow layout.
// Wide container: a normal table, which scrolls if it is too wide.
// Narrow container (less than stack-width px): each row is a block, and each cell shows its column header above its value.
// The table stays in the light DOM, so the page styles and the native table semantics apply.
// The element labels each cell from the header row. It sets the custom state "stacked" for the narrow layout.

const hostStyles = `
:host { display: block; inline-size: 100%; overflow-x: auto; }
:host([hidden]) { display: none; }
:host(:state(stacked)) { overflow-x: visible; }
`;

// These rules style the slotted table, so they must be in the document, not in the shadow root.
// The selectors start with vsa-table:state(stacked), so they win over page rules for one class, for example a column width.
const documentStyles = `
vsa-table:state(stacked) :is(table, tbody, tr, td) { display: block; width: auto; min-width: 0; }
vsa-table:state(stacked) thead {
  position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap;
}
vsa-table:state(stacked) tr {
  padding-block: var(--wa-space-s);
  border-block-end: var(--wa-border-style) var(--wa-border-width-s) var(--wa-color-surface-border);
}
vsa-table:state(stacked) td { padding: var(--wa-space-2xs) 0; border: 0; }
vsa-table:state(stacked) td[data-label]:not([data-label=""])::before {
  content: attr(data-label);
  display: block;
  margin-block-end: var(--wa-space-3xs);
  font-family: var(--wa-font-family-body);
  font-size: var(--wa-font-size-2xs);
  font-weight: var(--wa-font-weight-semibold);
  color: var(--wa-color-text-quiet);
}
`;

let documentSheetAdded = false;
function addDocumentStyles() {
  if (documentSheetAdded) return;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(documentStyles);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  documentSheetAdded = true;
}

class VsaTable extends HTMLElement {
  static observedAttributes = ['stack-width'];
  #internals = this.attachInternals();
  #resize = new ResizeObserver(() => this.#layout());
  #mutation = new MutationObserver(() => this.#label());

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style>${hostStyles}</style><slot></slot>`;
  }

  connectedCallback() {
    addDocumentStyles();
    this.#label();
    this.#layout();
    this.#resize.observe(this);
    this.#mutation.observe(this, { childList: true, subtree: true });
  }

  disconnectedCallback() {
    this.#resize.disconnect();
    this.#mutation.disconnect();
  }

  attributeChangedCallback() {
    this.#layout();
  }

  get stackWidth() {
    return Number(this.getAttribute('stack-width')) || 600;
  }
  set stackWidth(px) {
    this.setAttribute('stack-width', String(px));
  }

  get stacked() {
    return this.#internals.states.has('stacked');
  }

  #layout() {
    if (!this.isConnected) return;
    const stacked = this.clientWidth > 0 && this.clientWidth < this.stackWidth;
    if (stacked) this.#internals.states.add('stacked');
    else this.#internals.states.delete('stacked');
  }

  // Gives each body cell the text of its column header, also for a header cell with colspan.
  // When the layout is a block layout, some browsers drop the table semantics, so the cells also get ARIA roles.
  #label() {
    const table = this.querySelector('table');
    if (!table) return;
    this.#mutation.disconnect();
    const headers = [];
    for (const th of table.querySelectorAll('thead tr:last-child > th')) {
      for (let i = 0; i < th.colSpan; i++) headers.push(th.textContent.trim());
    }
    table.setAttribute('role', 'table');
    table.querySelectorAll('thead, tbody, tfoot').forEach(group => group.setAttribute('role', 'rowgroup'));
    table.querySelectorAll('tr').forEach(row => row.setAttribute('role', 'row'));
    table
      .querySelectorAll('th')
      .forEach(th => th.setAttribute('role', th.closest('thead') ? 'columnheader' : 'rowheader'));
    for (const row of table.querySelectorAll('tbody tr, tfoot tr')) {
      let column = 0;
      for (const cell of row.cells) {
        if (cell.localName === 'td') {
          cell.setAttribute('role', 'cell');
          if (headers[column] !== undefined) cell.dataset.label = headers[column];
        }
        column += cell.colSpan;
      }
    }
    if (this.isConnected) this.#mutation.observe(this, { childList: true, subtree: true });
  }
}

customElements.define('vsa-table', VsaTable);
