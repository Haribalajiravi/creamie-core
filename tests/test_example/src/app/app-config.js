import Boot from './app-boot.js';

export default {
    template: `app-component.html`,
    style: `app-component.css`,
    tag: 'app-component',
    isShadowDom: false,
    shadowMode: 'open',
    binder: 'data',
    boot: Boot
}