import { ArrayObserver } from './../arrayobserver.js';

export default class Loop {
  constructor() {
    this.loopAttribute = 'loop';
    this.loopItemAttribute = 'el';
    this.cloneCopy = {};
    this.observeArray = {};
    this.array = {};
    this.elementList = {};
    this.elementItemList = {};
  }

  get({ element, property, dataCache }) {
    if (dataCache[property] == undefined) {
      dataCache[property] = new Map();
    }
    if (this.cloneCopy[property] == undefined) {
      this.cloneCopy[property] = new Map();
    }
    this.cloneCopy[property].set(element, element.cloneNode(true));
    dataCache[property].set(element, {
      next: element.nextSibling,
      parent: element.parentNode,
    });
    this.observeArray[property] = new Map();
    this.elementList[property] = new Map();
    this.elementItemList[property] = new Map();
    this.array[property] = new Map();
    element.remove();
  }

  /**
   * It will get the new value from object and set it to the synced select
   * @param {object} param0
   * element, [current DOM element]
   * currentValue, [assigned value with respect to the object's property]
   * property, [Attribute value of if]
   */
  set({ element, currentValue, scopes, property, dataCache }) {
    this.observeArray[property].set(element, currentValue);
    let arrayObserver = new ArrayObserver(
      this.observeArray[property].get(element),
      ({ type, index, value }) => {
        // deleteProperty in Proxy is not widely call multiple instances.
        // So we are manually iterating callbacks
        if (type == 'removed') {
          for (let keyElement of dataCache[property].keys()) {
            this.observerCallback({
              property: property,
              type: type,
              index: index,
              value: value,
              dataCache: dataCache,
              element: keyElement,
            });
          }
        } else {
          this.observerCallback({
            property: property,
            type: type,
            index: index,
            value: value,
            dataCache: dataCache,
            element: element,
          });
        }
      }
    );
    scopes[property] = arrayObserver.getArray();
    this.array[property].set(element, arrayObserver.getActualArray());
    let elementList = this.elementList[property].get(element);
    for (
      let index = 0;
      elementList && index < elementList.length;
      index++
    ) {
      elementList[index].remove();
    }
    this.extend(
      property,
      currentValue,
      undefined,
      dataCache,
      element
    );
  }

  /**
   *
   * @param {string} property
   * @param {Array} items
   * passing indices indicates appending new items at bottom of listed items
   * @param {Array} indices
   * @param {object} dataCache
   * Below method will append additional items
   */
  extend(property, items, indices, dataCache, element) {
    /* Below block of code will refresh the items container if there is new set of data assigned */
    let rootFragment = document.createDocumentFragment();
    let elementList = [];
    let elementItemList = [];
    for (let index = 0; index < items.length; index++) {
      let newElement = this.cloneCopy[property]
        .get(element)
        .cloneNode(true);
      if (indices) {
        elementList[indices[index]] = newElement;
        elementItemList[indices[index]] = this.getLoopElements(
          newElement
        );
      } else {
        elementList[index] = newElement;
        elementItemList[index] = this.getLoopElements(newElement);
      }
      newElement.removeAttribute(this.loopAttribute);
      rootFragment.append(newElement);
    }
    this.elementList[property].set(element, elementList);
    this.elementItemList[property].set(element, elementItemList);
    for (let index = 0; index < items.length; index++) {
      let item = items[index];
      if (indices) {
        this.insertData(item, property, indices[index], element);
      } else {
        this.insertData(item, property, index, element);
      }
    }
    let localDataCache = dataCache[property].get(element);
    if (localDataCache.next) {
      localDataCache.parent.insertBefore(
        rootFragment,
        localDataCache.next
      );
    } else {
      localDataCache.parent.appendChild(rootFragment);
    }
  }

  /**
   * @param {HTMLElement} element
   * @returns {object}
   */
  getLoopElements(element) {
    let _this = this;
    let elements = element.querySelectorAll(
      `[${this.loopItemAttribute}]`
    );
    let array = [];
    elements.forEach((el) => {
      let elProperty = el.getAttribute(_this.loopItemAttribute);
      if (elProperty) {
        array.push({
          property: elProperty,
          element: el,
        });
        el.removeAttribute(_this.loopItemAttribute);
      }
    });
    return array;
  }

  /**
   * This method will insert `obj` data towards the cloned fragment
   * @param {Object} obj
   * @param {string} property
   * @param {number} index
   */
  insertData(obj, property, index, element) {
    let elementList = this.elementItemList[property].get(element);
    elementList[index].forEach((elData) => {
      let data = obj[elData.property];
      if (data) {
        elData.element.innerText = data;
      }
    });
  }

  observerCallback({
    property,
    type,
    index,
    value,
    dataCache,
    element,
  }) {
    let elementList = this.elementList[property].get(element);
    switch (type) {
      case 'added':
        this.extend(property, [value], [index], dataCache, element);
        break;
      case 'removed':
        elementList[index].remove();
        elementList.splice(index, 1);
        break;
      case 'modified':
        this.insertData(value, property, index, element);
        break;
    }
  }

  /**
   * It will return object which contains the boolean value of getter, setter conditional statement
   * @param {object} param0
   * element [current DOM element]
   */
  isMatched({ element, currentValue, attribute }) {
    return {
      getter:
        element.hasAttribute(this.loopAttribute) &&
        attribute == this.loopAttribute
          ? true
          : false,
      setter:
        element.hasAttribute(this.loopAttribute) &&
        attribute == this.loopAttribute &&
        Array.isArray(currentValue)
          ? true
          : false,
    };
  }
}
