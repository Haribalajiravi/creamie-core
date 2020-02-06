export default class Binder {

    constructor(bindAttribute, customElement, callbackToDOM) {
        this.scopes = {}
        if(bindAttribute && bindAttribute.length > 2) {
            this.bindAttribute = bindAttribute;
            this.dom = customElement;
            let _this = this;
            let elements = _this.dom.querySelectorAll(`[${_this.bindAttribute}]`);
            elements.forEach((element) => {
                let property = element.getAttribute(_this.bindAttribute);
                _this.addScopes(property, callbackToDOM);
                if (element.type === 'text' || element.type === 'textarea') {
                    element.onkeyup = function() {
                        _this.scopes[property] = element.value;
                    }
                }
            })
        } else if(bindAttribute) {
            throw this.getError('BINDER_ATTRIBUTE_LENGTH', bindAttribute);
        }
    }

    addScopes(property, callback) {
        let _this = this
        if (!_this.scopes.hasOwnProperty(property)) {
            let currentValue;
            Object.defineProperty(_this.scopes, property, {
                set: function(newValue) {
                    currentValue = newValue;
                    let elements = _this.dom.querySelectorAll(`[${_this.bindAttribute}]`)
                    elements.forEach((element) => {
                        if (element.getAttribute(_this.bindAttribute) == property) {
                            if (element.type && (element.type === 'text' || element.type === 'textarea')) {
                                element.value = newValue;
                            } else if (typeof newValue == 'string') {
                                element.innerText = newValue;
                            }
                            if (typeof callback == 'function') {
                                callback(element, newValue);
                            }
                        }
                    })
                },
                get: function() {
                    return currentValue;
                },
                enumerable: true
            });
        }
    }

    free() {
        this.scopes = {};
    }

    get() {
        return this.scopes;
    }

    getError(key, name) {
        let errors = {
            BINDER_ATTRIBUTE_LENGTH: `Keep the binder '${name}' attribute > 2 characters!`
        };
        return `Error[creamie]: ${errors[key]}`;
    }
}