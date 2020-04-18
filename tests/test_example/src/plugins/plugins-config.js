
import Boot from './plugins-boot.js';

export default {
    template: `plugins-component.html`,
    style: `plugins-component.css`,
    tag: 'plugins-component',
    isShadowDom: false,
    shadowMode: 'open',
    binder: 'data',
    boot: Boot,
    getterMethods: [
        ({element, property, data}) => {
            return {
                condition: (element.type && element.type == 'checkbox') ? true : false,
                method: () => {
                    element.addEventListener('click', ()=> {
                        data[property] = element.checked;
                    }, true);
                }
            }
        }
    ],
    setterMethods: [
        ({element, currentValue}) => {
            return {
                condition: (element.type && element.type == 'checkbox') ? true : false,
                method: () => {
                    element.checked = JSON.parse(currentValue);
                }
            }
        }
    ]
}