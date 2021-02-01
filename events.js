export default class Events {
  constructor(dom) {
    this.dom = dom ? dom : document;
    this.eventAttribute = 'e';
    this.eventsCache = {};
    this.methods = {};
    this.evenConstants = {
      NO_EVENT_FOUND: 'NO_EVENT_FOUND',
      NO_METHOD_FOUND: 'NO_METHOD_FOUND',
    };
  }

  init(methods) {
    let _this = this;
    this.methods = methods;
    let elements = _this.dom.querySelectorAll(
      `[${_this.eventAttribute}]`
    );
    elements.forEach((element) => {
      let values = element
        .getAttribute(_this.eventAttribute)
        .split(':');
      let eventName = values[0];
      let methodName = values[1];
      if (methods && methods[methodName]) {
        _this.eventsCache[eventName] = true;
      } else {
        if (!methods[methodName]) {
          throw _this.getError(
            this.evenConstants.NO_METHOD_FOUND,
            methodName
          );
        }
      }
    });
    let allEvents = Object.keys(_this.eventsCache);
    allEvents.forEach((event) => {
      let eventController = (e) => {
        let currentNode = e.target;
        let parents = [];
        while (currentNode.tagName != 'BODY') {
          parents.push(currentNode);
          currentNode = currentNode.parentNode;
        }
        let eventNodes = parents.filter((parent) =>
          parent.hasAttribute(_this.eventAttribute)
        );
        eventNodes.forEach((eventNode) => {
          let attrubuteValue = eventNode.getAttribute(
            _this.eventAttribute
          );
          let values = attrubuteValue.split(':');
          let methodName = values[1];
          !e.cancelBubble &&
            methodName &&
            _this.methods[methodName] &&
            _this.methods[methodName](e.target, e);
        });
      };
      _this.eventsCache[event] = eventController;
      _this.dom.addEventListener(event, eventController, true);
    });
  }

  removeListeners() {
    let _this = this;
    Object.keys(_this.eventsCache).forEach((event) => {
      _this.dom.removeEventListener(event, _this.eventsCache[event]);
    });
  }

  getError(key, name) {
    let errors = {
      NO_EVENT_FOUND: `There is no event called '${name}'`,
      NO_METHOD_FOUND: `There is no method called '${name}'`,
    };
    return `Error[creamie]: ${errors[key]}`;
  }
}
