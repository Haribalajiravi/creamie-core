export default class TextField {
  /**
   * It will register a listener to perform a data transfer from textfield to object
   * @param {object} param0
   * element, [current DOM element]
   * scopes, [refferenced object to map with DOM]
   * property, [binded object's key]
   * dataCache, [extra data source to maintain operations and destroy in future]
   */
  get({ element, scopes, property, dataCache }) {
    let eventController = () => {
      scopes[property] = element.value;
    };
    element.addEventListener('keyup', eventController, true);
    // assigning event details to remove it when component destroys
    dataCache[property] = {
      event: 'keyup',
      method: eventController,
    };
  }

  /**
   * It will get the new value from object and set it to the synced textfield
   * @param {object} param0
   * element, [current DOM element]
   * currentValue, [assigned value with respect to the object's property]
   */
  set({ element, currentValue }) {
    element.value = currentValue;
  }

  /**
   * It will return object which contains the boolean value of getter, setter conditional statement
   * @param {object} param0
   * element [current DOM element]
   */
  isMatched({ element }) {
    return {
      getter:
        element.type &&
        (element.type === 'text' || element.type === 'textarea')
          ? true
          : false,
      setter:
        element.type &&
        (element.type === 'text' || element.type === 'textarea')
          ? true
          : false,
    };
  }

  /**
   * It will remove the event listeners
   * @param {object} param0
   * element, [current DOM element]
   * dataCache, [extra data source to maintain operations and destroy in future]
   */
  destroy({ element, dataCache }) {
    element.removeEventListener(dataCache.event, dataCache.method);
  }
}
