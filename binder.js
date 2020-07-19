import PluginConnector from './pluginConnector.js';

export default class Binder {
  constructor({
    bindAttribute,
    customElement,
    getterMethods,
    setterMethods,
    destroyMethods,
    excludePlugins,
  }) {
    this.scopes = {};
    this.domCache = [];
    this.dataCache = {};
    this.getterMethods =
      Array.isArray(getterMethods) && getterMethods.length
        ? getterMethods
        : [];
    this.setterMethods =
      Array.isArray(setterMethods) && setterMethods.length
        ? setterMethods
        : [];
    this.destroyMethods =
      Array.isArray(destroyMethods) && destroyMethods.length
        ? destroyMethods
        : [];
    this.pluginConnector = new PluginConnector({
      scopes: this.scopes,
      dataCache: this.dataCache,
      excludePlugins: excludePlugins,
    });
    this.propertyMap = {};
    this.attributeMap = {};
    this.elementMap = {};
    if (bindAttribute && bindAttribute.length > 2) {
      this.bindAttribute = bindAttribute;
      this.dom = customElement;
      const _this = this;
      let counter = 0;
      ['if', 'loop', _this.bindAttribute].forEach((attribute) => {
        _this.dom.querySelectorAll(`[${attribute}]`).forEach(() => {
          _this.attributeMap[counter++] = attribute;
        });
      });
      _this.domCache = [
        ..._this.dom.querySelectorAll('[if]'),
        ..._this.dom.querySelectorAll('[loop]'),
        ..._this.dom.querySelectorAll(`[${_this.bindAttribute}]`),
      ];
      _this.domCache.forEach((element, index) => {
        let attribute = _this.attributeMap[index];
        let property = element.getAttribute(attribute);
        _this.elementMap[property] = element;
        _this.propertyMap[index] = property;
        if (
          _this.pluginConnector.isMatched({
            element: element,
            property: property,
            type: 'getter',
            attribute: attribute,
          })
        ) {
          _this.pluginConnector.getter();
        } else {
          for (let i = 0; i < _this.getterMethods.length; i++) {
            _this.dataCache[property] = {};
            try {
              let getterObj = _this.getterMethods[i]({
                element: element,
                data: _this.scopes,
                property: property,
                cache: _this.dataCache[property],
                allCache: _this.dataCache,
              });
              if (getterObj.condition === true) {
                getterObj.method();
                break;
              }
            } catch (error) {
              throw (
                `[${property}] <= respective getterMethods[${i}] ` +
                error
              );
            }
          }
        }
        _this.addScopes(property);
        if (attribute != 'if' && attribute != 'loop') {
          element.removeAttribute(_this.bindAttribute);
        }
      });
    } else if (bindAttribute) {
      throw this.getError('BINDER_ATTRIBUTE_LENGTH', bindAttribute);
    }
  }

  addScopes(property) {
    let _this = this;
    if (
      !Object.prototype.hasOwnProperty.call(_this.scopes, property)
    ) {
      let currentValue;
      Object.defineProperty(_this.scopes, property, {
        set: function (newValue) {
          currentValue = newValue;
          _this.domCache.forEach((element, index) => {
            let attribute = _this.attributeMap[index];
            if (_this.propertyMap[index] == property) {
              if (
                _this.pluginConnector.isMatched({
                  element: element,
                  property: property,
                  type: 'setter',
                  currentValue: currentValue,
                  oldValue: _this.scopes[property],
                  attribute: attribute,
                })
              ) {
                _this.pluginConnector.setter();
              } else {
                let passed = _this.ladderExecutor(
                  {
                    currentValue: currentValue,
                    element: element,
                    data: _this.scopes,
                    property: property,
                    cache: _this.dataCache[property],
                    allCache: _this.dataCache,
                  },
                  'setterMethods'
                );
                if (
                  !passed &&
                  attribute != 'if' &&
                  attribute != 'loop'
                ) {
                  element.innerText = newValue;
                }
              }
            }
          });
        },
        get: function () {
          return currentValue;
        },
        enumerable: true,
      });
    }
  }

  setData(newScopes) {
    let _this = this;
    Object.keys(newScopes).forEach((property) => {
      if (
        Object.prototype.hasOwnProperty.call(_this.scopes, property)
      ) {
        _this.scopes[property] = newScopes[property];
      }
    });
  }

  push(property, newScope) {
    let newScopes = [];
    newScopes.push(newScope);
    this.extend(property, newScopes);
  }

  extend(property, newScopes) {
    let scopes = this.scopes[property];
    if (scopes && Array.isArray(scopes)) {
      newScopes.forEach((scope) => scopes.push(scope));
      let element = this.elementMap[property];
      // index '1' denotes Loop() class
      let loop = this.pluginConnector.plugins[1];
      loop.extend(property, element, newScopes);
    }
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
        throw (
          `[${dataObject.property}] <= respective ${methodProperty}[${i}] :` +
          error
        );
      }
    }
    return passed;
  }

  canSetInnerText() {}

  free() {
    let _this = this;
    this.domCache.forEach((element, index) => {
      let property = _this.propertyMap[index];
      if (
        _this.pluginConnector.isMatched({
          element: element,
          scopes: _this.scopes,
          property: property,
          dataCache: _this.dataCache,
          type: 'getter',
        })
      ) {
        _this.pluginConnector.destroyer();
      } else if (
        Array.isArray(_this.destroyMethods) &&
        _this.destroyMethods.length
      ) {
        _this.ladderExecutor(
          {
            element: element,
            data: _this.scopes,
            property: property,
            cache: _this.dataCache[property],
            allCache: _this.dataCache,
          },
          'destroyMethods'
        );
      }
    });
  }

  get() {
    return this.scopes;
  }

  getError(key, name) {
    let errors = {
      BINDER_ATTRIBUTE_LENGTH: `Keep the binder '${name}' attribute > 2 characters!`,
    };
    return `Error[creamie]: ${errors[key]}`;
  }
}
