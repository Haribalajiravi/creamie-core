export default class Loop {
  constructor() {
    this.loopAttribute = 'loop';
    this.loopItemAttribute = 'el';
    this.cloneCopy = {};
  }

  get({ element, scopes, property }) {
    this.cloneCopy[property] = element.cloneNode(true);
    scopes[property] = [];
    element.innerHTML = '';
  }

  /**
   * It will get the new value from object and set it to the synced select
   * @param {object} param0
   * element, [current DOM element]
   * currentValue, [assigned value with respect to the object's property]
   * property, [Attribute value of if]
   */
  set({ element, currentValue }) {
    this.extend(element, currentValue);
  }

  /**
   *
   * @param {HTMLElement} element
   * @param {Array} items
   * @param {Function} callback
   * Below method will append additional items
   */
  extend(property, element, items) {
    let rootFragment = document.createDocumentFragment();
    for (let index = 0; index < items.length; index++) {
      let item = items[index];
      let newFragment = this.createNodeListFragment(
        this.cloneCopy[property]
      );
      this.insertData(newFragment, item);
      rootFragment.append(newFragment);
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
    return fragment;
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
