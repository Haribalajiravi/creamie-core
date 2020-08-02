import { ArrayObserver } from './../arrayobserver.js';

export default class Loop {
  constructor() {
    this.loopAttribute = 'loop';
    this.loopItemAttribute = 'el';
    this.cloneCopy = {};
    this.observeArray = {};
    this.array = {};
    this.elementList = {};
  }

  get({ element, property }) {
    this.cloneCopy[property] = element.cloneNode(true);
    this.observeArray[property] = [];
    this.elementList[property] = [];
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  /**
   * It will get the new value from object and set it to the synced select
   * @param {object} param0
   * element, [current DOM element]
   * currentValue, [assigned value with respect to the object's property]
   * property, [Attribute value of if]
   */
  set({ element, currentValue, scopes, property }) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    this.observeArray[property] = currentValue;
    let arrayObserver = new ArrayObserver(
      this.observeArray[property],
      ({ type, index, value }) => {
        this.observerCallback({
          property: property,
          element: element,
          type: type,
          index: index,
          value: value,
        });
      }
    );
    scopes[property] = arrayObserver.getArray();
    this.array[property] = arrayObserver.getActualArray();
    this.extend(property, element, currentValue);
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {Array} items
   * @param {Function} callback
   * Below method will append additional items
   */
  extend(property, element, items, indices) {
    let rootFragment = document.createDocumentFragment();
    for (let index = 0; index < items.length; index++) {
      let item = items[index];
      let newElement = this.createNodeListFragment(
        this.cloneCopy[property]
      );
      if (indices) {
        this.elementList[property][indices[index]] = newElement;
      } else {
        this.elementList[property][index] = newElement;
      }
      this.insertData(newElement, item);
      rootFragment.append(newElement);
    }
    element.appendChild(rootFragment);
  }

  /**
   *
   * @param {HTMLElement} element
   * This method will make a copy of element as fragment
   */
  createNodeListFragment(element) {
    let nodeList = element.childNodes;
    let fragment = document.createDocumentFragment();
    for (let index = 0; index < nodeList.length; index++) {
      let cloneNode = nodeList[index].cloneNode(true);
      fragment.appendChild(cloneNode);
    }
    let newElement = document.createElement('element');
    newElement.appendChild(fragment);
    return newElement;
  }

  /**
   *
   * @param {HTMLDocument} fragment
   * @param {Object} obj
   * This method will insert `obj` data towards the cloned fragment
   */
  insertData(fragment, obj) {
    let _this = this;
    let els = fragment.querySelectorAll(
      `[${_this.loopItemAttribute}]`
    );
    els.forEach((el) => {
      let elProperty = el.getAttribute(`${_this.loopItemAttribute}`);
      let data = obj[elProperty];
      if (data) {
        el.innerText = data;
      }
    });
  }

  observerCallback({ property, element, type, index, value }) {
    switch (type) {
      case 'added':
        this.extend(property, element, [value], [index]);
        break;
      case 'removed':
        this.elementList[property][index].remove();
        this.elementList[property].splice(index, 1);
        break;
      case 'modified':
        this.insertData(this.elementList[property][index], value);
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
