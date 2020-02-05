import Creamie from './../../../../creamie.js';
import AppConfig from './app-config.js';

export default class App extends Creamie {
    constructor() {
        super(AppConfig);
        console.log("App constructor!");
    }

    connectedCallback() {
        console.log('connected!');
    }
}

window.customElements.define(AppConfig.tag, App);