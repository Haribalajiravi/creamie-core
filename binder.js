import { ArrayObserverType } from './arrayobserver.js';
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
    (this.scopes = {}),
      (this.domCache = []),
      (this.dataCache = {}),
      (this.propertyMap = []),
      (this.attributeMap = []),
      (this.getterMethods = []),
      (this.setterMethods = []),
      (this.destroyMethods = []),
      (this.bindAttribute = 'data'),
      (this.dom = undefined),
      (this.pluginConnector = undefined);
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
      binder: this,
    });
    if (bindAttribute && bindAttribute.length > 2) {
      this.bindAttribute = bindAttribute;
      this.initListener(customElement);
    } else if (bindAttribute) {
      throw this.getError('BINDER_ATTRIBUTE_LENGTH', bindAttribute);
    }
  }

  initListener(customElement, type) {
    const _this = this;
    let binderDomMap = {
      if: customElement.querySelectorAll('[if]'),
      loop: customElement.querySelectorAll('[loop]'),
    };
    binderDomMap[
      _this.bindAttribute
    ] = customElement.querySelectorAll(`[${_this.bindAttribute}]`);
    let binderDoms = [];
    ['if', 'loop', _this.bindAttribute].forEach((attribute) => {
      binderDoms = [...binderDoms, ...binderDomMap[attribute]];
      binderDomMap[attribute].forEach(() => {
        _this.attributeMap.push(attribute);
      });
    });
    _this.domCache = [..._this.domCache, ...binderDoms];
    let tempData = {};
    if (type == 'reinit') {
      tempData = {
        domCache: binderDoms,
        attributeIndex: _this.attributeMap.length - 1,
      };
    } else {
      tempData = {
        domCache: _this.domCache,
        attributeIndex: 0,
      };
    }
    tempData.domCache.forEach((element) => {
      let attribute = _this.attributeMap[tempData.attributeIndex++];
      let property = element.getAttribute(attribute);
      _this.propertyMap.push(property);
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
          if (!(currentValue instanceof ArrayObserverType)) {
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
          }
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
