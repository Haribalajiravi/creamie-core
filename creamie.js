import Binder from './binder';
import Template from './template';

export default class Creamie extends HTMLElement {

    constructor(component) {
        super();
        this.component = component;
        this.DOM = (this.component.isShadowDom) ? this._shadowRoot = this.attachShadow({
            'mode': this.component.shadowMode
        }) : this;
        let template = new Template(this.component.template, this.component.style);
        this.DOM.appendChild(template.get());
        this.binder = new Binder(this.component.binder, this.DOM);
        this.data = this.binder.get();
    }

    static get observedAttributes() {}

    disconnectedCallback() {
        this.binder.free();
    }

    attributeChangedCallback(name, oldVal, newVal) {
        console.log(`Attribute: ${name} - ${newVal} - ${oldVal} changed!`);
    }

    adoptedCallback() {}
}