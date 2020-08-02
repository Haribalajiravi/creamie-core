class ArrayObserverType {}
/**
 * This will observe array to capture element addition, removal and modification.
 */
class ArrayObserver {
  constructor(actualArray, callback) {
    this.actualArray = actualArray;
    if (callback && typeof callback == 'function') {
      this.callback = callback;
      this.array = new Proxy(actualArray, {
        getPrototypeOf: function () {
          return ArrayObserverType.prototype;
        },
        // for existing element removal
        deleteProperty: function (target, index) {
          let value = target[Number(index)];
          callback({
            type: 'removed',
            target: target,
            index: Number(index),
            value: value,
          });
          return true;
        },
        set: function (target, index, value) {
          let type;
          // for new element added
          if (
            Number.isInteger(Number(index)) &&
            actualArray.length == target.length &&
            Number(index) > actualArray.length - 1
          ) {
            type = 'added';
          }
          // for existing element modification at index
          else if (
            Number.isInteger(Number(index)) &&
            Number(index) < target.length
          ) {
            type = 'modified';
          }
          if (type) {
            callback({
              type: type,
              target: target,
              index: Number(index),
              value: value,
            });
          }
          target[index] = value;
          return true;
        },
      });
    } else {
      console.error('ArrayObserver: callback is missing.');
    }
  }

  getActualArray() {
    return this.actualArray;
  }

  getArray() {
    return this.array;
  }
}

export { ArrayObserverType, ArrayObserver };
