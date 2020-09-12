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
    this.cloneCopy[property] = element.cloneNode(true);
    dataCache[property] = {
      next: element.nextSibling,
      parent: element.parentNode,
    };
    this.observeArray[property] = [];
    this.elementList[property] = [];
    this.elementItemList[property] = [];
    element.remove();
  }

  /**
   * It will get the new value from object and set it to the synced select
   * @param {object} param0
   * element, [current DOM element]
   * currentValue, [assigned value with respect to the object's property]
   * property, [Attribute value of if]
   */
  set({ currentValue, scopes, property, dataCache }) {
    this.observeArray[property] = currentValue;
    let arrayObserver = new ArrayObserver(
      this.observeArray[property],
      ({ type, index, value }) => {
        this.observerCallback({
          property: property,
          type: type,
          index: index,
          value: value,
          dataCache: dataCache,
        });
      }
    );
    scopes[property] = arrayObserver.getArray();
    this.array[property] = arrayObserver.getActualArray();
    for (
      let index = 0;
      index < this.elementList[property].length;
      index++
    ) {
      this.elementList[property][index].remove();
    }
    this.elementList[property] = [];
    this.elementItemList[property] = [];
    this.extend(property, currentValue, undefined, dataCache);
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
  extend(property, items, indices, dataCache) {
    /* Below block of code will refresh the items container if there is new set of data assigned */
    let rootFragment = document.createDocumentFragment();
    for (let index = 0; index < items.length; index++) {
      let item = items[index];
      let newElement = this.cloneCopy[property].cloneNode(true);
      if (indices) {
        this.elementList[property][indices[index]] = newElement;
        this.elementItemList[property][
          indices[index]
        ] = this.getLoopElements(newElement);
        this.insertData(item, property, indices[index]);
      } else {
        this.elementList[property][index] = newElement;
        this.elementItemList[property][index] = this.getLoopElements(
          newElement
        );
        this.insertData(item, property, index);
      }
      newElement.removeAttribute(this.loopAttribute);
      rootFragment.append(newElement);
    }
    if (dataCache[property].next) {
      dataCache[property].parent.insertBefore(
        rootFragment,
        dataCache[property].next
      );
    } else {
      dataCache[property].parent.appendChild(rootFragment);
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
  insertData(obj, property, index) {
    this.elementItemList[property][index].forEach((elData) => {
      let data = obj[elData.property];
      if (data) {
        elData.element.innerText = data;
      }
    });
  }

  observerCallback({ property, type, index, value, dataCache }) {
    switch (type) {
      case 'added':
        this.extend(property, [value], [index], dataCache);
        break;
      case 'removed':
        this.elementList[property][index].remove();
        this.elementList[property].splice(index, 1);
        break;
      case 'modified':
        this.insertData(value, property, index);
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
