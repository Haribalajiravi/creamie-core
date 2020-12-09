import DOMRememberer from './../domrememberer.js';

export default class If {
  constructor() {
    this.ifAttribute = 'if';
  }

  get({ element, property, dataCache }) {
    /**
     * Register element to DOMRememberer to insert and remove
     */
    if (dataCache[property] == undefined) {
      dataCache[property] = new Map();
    }
    let domRememberer = new DOMRememberer(element);
    dataCache[property].set(element, domRememberer);
  }

  /**
   * It will get the new value from object and set it to the synced select
   * @param {object} param0
   * element, [current DOM element]
   * currentValue, [assigned value with respect to the object's property]
   * property, [Attribute value of if]
   */
  set({ element, currentValue, property, dataCache }) {
    if (typeof currentValue == 'boolean') {
      let domRemembererMap = dataCache[property];
      if (currentValue && domRemembererMap) {
        domRemembererMap.get(element).insert();
      } else {
        domRemembererMap.get(element).remove();
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
  isMatched({ element, currentValue, attribute, uid }) {
    return {
      getter:
        element.creamie[uid] &&
        element.creamie[uid].attribute == this.ifAttribute &&
        attribute == this.ifAttribute
          ? true
          : false,
      setter:
        element.creamie[uid] &&
        element.creamie[uid].attribute == this.ifAttribute &&
        attribute == this.ifAttribute &&
        typeof currentValue == 'boolean'
          ? true
          : false,
    };
  }
}
