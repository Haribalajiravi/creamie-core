import Creamie from './../../../../creamie.js';
import AppConfig from './app-config.js';
import Router from './../../../../router.js';
import Exclude from './../exclude/exclude-component.js';

export default class App extends Creamie {
  constructor() {
    super(AppConfig);
    let _this = this;
    this.events.init({
      changeData: function (e) {
        _this.data.name = 'Data Changed';
        console.log(this, e);
      },
      setRouterParam: function () {
        console.log(_this.router);
        _this.data.routerId = _this.router.params.routerId;
      },
      hide: function () {
        _this.data.canHave = false;
      },
      show: function () {
        _this.data.canHave = true;
      },
      hide2: function () {
        _this.data.showReflector = false;
      },
      show2: function () {
        _this.data.showReflector = true;
      },
      addData: function () {
        _this.binder.push('items', {
          itemName: 'creamie',
        });
      },
    });
    this.router = new Router('route-app', {
      '/tester': Exclude,
      '/test/{routerId}': Exclude,
    });
    this.router.init();
    console.log('App constructor!');
  }

  connectedCallback() {
    console.log('connected!');
  }
}

window.customElements.define(AppConfig.tag, App);
