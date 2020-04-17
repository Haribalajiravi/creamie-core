import PluginConnector from './pluginConnector';

export default class Binder {

    constructor({
        bindAttribute,
        customElement,
        getterMethods,
        setterMethods,
        destroyMethods,
        excludePlugins
    }) {
        this.scopes = {};
        this.domCache = null;
        this.dataCache = {};
        this.setterMethods = (Array.isArray(setterMethods) && setterMethods.length) ? setterMethods : [];
        this.destroyMethods = (Array.isArray(destroyMethods) && destroyMethods.length) ? destroyMethods : [];
        this.pluginConnector = new PluginConnector({
            scopes: this.scopes,
            dataCache: this.dataCache,
            excludePlugins: excludePlugins
        });
        this.weakmap = new WeakMap();
        if (bindAttribute && bindAttribute.length > 2) {
            this.bindAttribute = bindAttribute;
            this.dom = customElement;
            let _this = this;
            _this.domCache = _this.dom.querySelectorAll(`[${_this.bindAttribute}]`);
            _this.domCache.forEach((element) => {
                let property = element.getAttribute(_this.bindAttribute);
                _this.weakmap.set(element, property);
                _this.addScopes(property);

                // Plugin connector will come here
                if (_this.pluginConnector.isMatched({
                    element: element,
                    property: property,
                    type: 'getter',
                })) {
                    _this.pluginConnector.getter();
                } if (Array.isArray(getterMethods) && getterMethods.length) {
                    for (let i = 0; i < getterMethods.length; i++) {
                        _this.dataCache[property] = {};
                        try {
                            let getterObj = getterMethods[i]({
                                element: element,
                                data: _this.scopes,
                                property: property,
                                cache: _this.dataCache[property],
                                allCache: _this.dataCache
                            });
                            if (getterObj.condition === true) {
                                getterObj.method();
                                break;
                            }
                        } catch (error) {
                            throw `[${property}] <= respective getterMethods[${i}] ` + error;
                        }
                    }
                }
                element.removeAttribute(_this.bindAttribute);
            })
        } else if (bindAttribute) {
            throw this.getError('BINDER_ATTRIBUTE_LENGTH', bindAttribute);
        }
    }

    addScopes(property) {
        let _this = this
        if (!_this.scopes.hasOwnProperty(property)) {
            let currentValue;
            Object.defineProperty(_this.scopes, property, {
                set: function (newValue) {
                    currentValue = newValue;
                    _this.domCache.forEach((element) => {
                        if (_this.weakmap.get(element) == property) {
                            if (_this.pluginConnector.isMatched({
                                element: element,
                                property: property,
                                type: 'setter',
                                currentValue: currentValue,
                                oldValue: _this.scopes[property],
                            })) {
                                _this.pluginConnector.setter();
                            } else if (Array.isArray(_this.setterMethods) && _this.setterMethods.length) {
                                let passed = _this.ladderExecutor({
                                    currentValue: currentValue,
                                    element: element,
                                    data: _this.scopes,
                                    property: property,
                                    cache: _this.dataCache[property],
                                    allCache: _this.dataCache
                                }, 'setterMethods');
                                if (!passed) {
                                    element.innerText = newValue;
                                }
                            }
                        }
                    });
                },
                get: function () {
                    return currentValue;
                },
                enumerable: true
            });
        }
    }

    setData(newScopes) {
        let _this = this;
        Object.keys(newScopes).forEach((property) => {
            if (_this.scopes.hasOwnProperty(property)) {
                _this.scopes[property] = newScopes[property];
            }
        });
    }

    ladderExecutor(dataObject, methodProperty) {
        let passed = false;
        for (let i = 0; i < this[methodProperty].length; i++) {
            try {
                let ladderObj = this[methodProperty][i](dataObject);
                if (ladderObj.condition === true) {
                    ladderObj.method();
                    passed = true;
                    break;
                }
            } catch (error) {
                throw `[${dataObject.property}] <= respective ${methodProperty}[${i}] :` + error;
            }
        }
        return passed;
    }

    free() {
        let _this = this;
        this.domCache.forEach((element, index) => {
            let property = _this.weakmap.get(element);
            if (_this.pluginConnector.isMatched({
                element: element,
                scopes: _this.scopes,
                property: property,
                dataCache: _this.dataCache,
                type: 'getter'
            })) {
                _this.pluginConnector.destroyer();
            } else if (Array.isArray(_this.destroyMethods) && _this.destroyMethods.length) {
                _this.ladderExecutor({
                    element: element,
                    data: _this.scopes,
                    property: property,
                    cache: _this.dataCache[property],
                    allCache: _this.dataCache
                }, 'destroyMethods');
            }
        });
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