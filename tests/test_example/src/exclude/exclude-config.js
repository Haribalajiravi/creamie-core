import Boot from './exclude-boot.js';
import TextField from './../../../../plugins/textfield.js';
import Select from './../../../../plugins/select.js';

export default {
  template: `exclude-component.html`,
  style: `exclude-component.css`,
  tag: 'exclude-component',
  isShadowDom: false,
  shadowMode: 'open',
  binder: 'data',
  boot: Boot,
  excludePlugins: [TextField, Select],
  getterMethods: [
    ({ element, property, data }) => {
      return {
        condition:
          element.type && element.type == 'checkbox' ? true : false,
        method: () => {
          element.addEventListener(
            'click',
            () => {
              data[property] = element.checked;
            },
            true
          );
        },
      };
    },
  ],
  setterMethods: [
    ({ element, currentValue }) => {
      return {
        condition:
          element.type && element.type == 'checkbox' ? true : false,
        method: () => {
          element.checked = JSON.parse(currentValue);
        },
      };
    },
  ],
};
