import DOMRememberer from './../domrememberer.js';

export default class If {
  constructor() {
    this.ifAttribute = 'if';
  }

  get({ element, property, dataCache }) {
    /**
     * Register element to DOMRememberer to insert and remove
     */
    dataCache[property] = new DOMRememberer(element);
  }

  /**
   * It will get the new value from object and set it to the synced select
   * @param {object} param0
   * element, [current DOM element]
   * currentValue, [assigned value with respect to the object's property]
   * property, [Attribute value of if]
   */
  set({ currentValue, property, dataCache }) {
    if (typeof currentValue == 'boolean') {
      if (currentValue) {
        dataCache[property].insert();
      } else {
        dataCache[property].remove();
      }
    } else {
      throw `${property} should be boolean type.`;
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
        element.hasAttribute(this.ifAttribute) &&
        attribute == this.ifAttribute
          ? true
          : false,
      setter:
        element.hasAttribute(this.ifAttribute) &&
        attribute == this.ifAttribute &&
        typeof currentValue == 'boolean'
          ? true
          : false,
    };
  }
}
