import Creamie from './../../../../creamie.js';
import AppConfig from './app-config.js';
import Router from './../../../../router.js';
import Exclude from './../exclude/exclude-component.js';

export default class App extends Creamie {
  constructor() {
    super(AppConfig);
    let _this = this;
    this.loop.items.setPreprocessor((data, index) => {
      data.index = index+1;
      data.indexpp = index + 2;
    });
    this.events.init({
      changeData: function () {
        _this.data.name = 'Data Changed';
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
        _this.data.items = [];
        _this.data.items.push({
          itemName: 'creamie',
        });
      },
      inClick: function (current, event) {
        document.getElementById('bubble-data').innerText = '1';
        if(document.getElementById('stop-propagate').checked) {
          event.stopPropagation();
        }
      },
      outClick: function () {
        document.getElementById('bubble-data').innerText = '2';
      }
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
