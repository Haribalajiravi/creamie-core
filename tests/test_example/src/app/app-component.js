import Creamie from './../../../../creamie.js';
import AppConfig from './app-config.js';

export default class App extends Creamie {
    constructor() {
        super(AppConfig);
        let _this = this;
        this.events.init({
            changeData: function (e) {
                _this.data.name = "Data Changed";
                console.log(this, e);
            }
        });
        console.log("App constructor!");
    }

    connectedCallback() {
        console.log('connected!');
    }
}

window.customElements.define(AppConfig.tag, App);