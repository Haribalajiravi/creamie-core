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
        let targetElem = e.target.getAttribute(_this.eventAttribute);
        if (targetElem) {
          let values = targetElem.split(':');
          let methodName = values[1];
          _this.methods[methodName](e.target, e);
        }
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
