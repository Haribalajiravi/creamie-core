import Template from './template.js';
import Binder from './binder.js';
import Events from './events.js';

export default class Creamie extends HTMLElement {
  constructor(component) {
    super();
    this.component = component;
    this.dom = this.component.isShadowDom
      ? (this._shadowRoot = this.attachShadow({
          mode: this.component.shadowMode,
        }))
      : this;
    let template = new Template(
      this.component.template,
      this.component.style,
      this.component.boot
    );
    this.dom.appendChild(template.get());
    this.binder = new Binder({
      bindAttribute: this.component.binder,
      customElement: this.dom.querySelector('body'),
      getterMethods: component.getterMethods,
      setterMethods: component.setterMethods,
      destroyMethods: component.destroyMethods,
      excludePlugins: component.excludePlugins,
    });
    this.data = this.binder.get();
    this.events = new Events(this.dom);
  }

  disconnectedCallback() {
    this.events.removeListeners();
    this.binder.free();
  }
}
