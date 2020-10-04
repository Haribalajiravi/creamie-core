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
      (this.uids = []),
      (this.getterMethods = []),
      (this.setterMethods = []),
      (this.destroyMethods = []),
      (this.bindAttribute = 'data'),
      (this.dom = customElement),
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
    let binderDoms = [];
    [
      {
        attribute: 'if',
        elements: customElement.querySelectorAll('[if]'),
      },
      {
        attribute: 'loop',
        elements: customElement.querySelectorAll('[loop]'),
      },
      {
        attribute: this.bindAttribute,
        elements: customElement.querySelectorAll(
          `[${this.bindAttribute}]`
        ),
      },
    ].forEach((data) => {
      data.elements.forEach((element) => {
        binderDoms.push(element);
        let uid = (Date.now() + Math.random()).toString(36);
        _this.uids.push(uid);
        if (
          !Object.prototype.hasOwnProperty.call(element, 'creamie')
        ) {
          element.creamie = {
            attributes: [],
          };
        }
        let property = element.getAttribute(data.attribute);
        element.creamie.attributes.push({
          name: data.attribute,
          value: property,
        });
        element.creamie[uid] = {
          attribute: data.attribute,
          property: property,
        };
        element.removeAttribute(data.attribute);
      });
    });
    this.domCache = [..._this.domCache, ...binderDoms];
    let tempData = {};
    if (type == 'reinit') {
      tempData.domCache = binderDoms;
      tempData.uidIndex = _this.uids.length - 1;
    } else {
      tempData.domCache = this.domCache;
      tempData.uidIndex = 0;
    }
    tempData.domCache.forEach((element) => {
      let uid = _this.uids[tempData.uidIndex++];
      let attribute = element.creamie[uid].attribute;
      let property = element.creamie[uid].property;
      if (
        _this.pluginConnector.isMatched({
          element: element,
          property: property,
          type: 'getter',
          attribute: attribute,
          uid: uid,
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
              uid: uid,
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
    });
  }

  addScopes(scopeProperty) {
    let _this = this;
    if (
      !Object.prototype.hasOwnProperty.call(
        _this.scopes,
        scopeProperty
      )
    ) {
      let currentValue;
      Object.defineProperty(_this.scopes, scopeProperty, {
        set: function (newValue) {
          currentValue = newValue;
          if (!(currentValue instanceof ArrayObserverType)) {
            _this.domCache.forEach((element, index) => {
              let uid = _this.uids[index];
              let attribute = element.creamie[uid].attribute;
              let property = element.creamie[uid].property;
              if (property == scopeProperty) {
                if (
                  _this.pluginConnector.isMatched({
                    element: element,
                    property: scopeProperty,
                    type: 'setter',
                    currentValue: currentValue,
                    oldValue: _this.scopes[scopeProperty],
                    attribute: attribute,
                    uid: uid,
                  })
                ) {
                  _this.pluginConnector.setter();
                } else {
                  let passed = _this.ladderExecutor(
                    {
                      currentValue: currentValue,
                      element: element,
                      data: _this.scopes,
                      property: scopeProperty,
                      cache: _this.dataCache[scopeProperty],
                      allCache: _this.dataCache,
                      uid: uid,
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

  getCreamieNodes(element, attribute) {
    const nodeIterator = document.createNodeIterator(
      element,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          return node.creamie &&
            node.creamie.attributes.find((data) => {
              return data.name == attribute;
            })
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        },
      }
    );
    const nodes = [];
    let currentNode;
    while ((currentNode = nodeIterator.nextNode())) {
      nodes.push(currentNode);
    }
    return nodes;
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
