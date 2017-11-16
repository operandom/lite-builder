import { html } from '../../core/html.js';

export const TAG = 'hello-world';
export const STYLE    = './components/hello-world/hello-world.css';

export const TEMPLATE = html`
  <header>
    <div>
      <slot name="header">
        <h1>Header</h1>
      </slot>
    </div>
  </header>

  <article>
    <slot></slot>
  </article>

  <footer>
    <slot name=footer>footer</slot>
  </footer>
`;


/**
 * My incredible HelloWorld element
 */
export class HelloWorld extends HTMLElement {

  static register() {
    return inject().then(() => {
      customElements.define(TAG, HelloWorld);
    });
  }


  static get observedAttributes() {
    return [
      'header-image',
    ];
  }


  constructor() {
    super();

    /** @type {ShadowRoot} */
    const $shadow = this.attachShadow({ mode: 'open' });

    /** @type {HTMLLinkElement|null}  */
    const $template = document.querySelector(`link[href="${TEMPLATE}"]`);

    TEMPLATE.forEach(node => $shadow.appendChild(node.cloneNode(true)));


    const $style = document.createElement('link');
    $style.rel = 'stylesheet';
    $style.href = STYLE;

    $shadow.appendChild($style);

    this.$header = $shadow.querySelector('header');
  }


  /**
   * @param {string} attr
   * @param {any} oldValue
   * @param {any} newValue
   */
  attributeChangedCallback(attr, oldValue, newValue) {
    switch (attr) {
      case 'header-image':
        if (this.$header) {
          this.$header.style.backgroundImage = `url("${newValue}")`;
        }
        break;

      default:
        break;
    }
  }


  connectedCallback() {

  }


  disconnectedCallback() {

  }
}



export function inject() {
  return Promise.all([
      new Promise((resolve, reject) => {
        resolve();
      }),
  ]);
}
