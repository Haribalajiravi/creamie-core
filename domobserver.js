class DOMObserver {
  constructor(addedCallback, removedCallback) {
    this.observer = new MutationObserver(
      (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          addedCallback &&
            mutation.addedNodes.length != 0 &&
            addedCallback(mutation.addedNodes, mutation, observer);
          removedCallback &&
            mutation.removedNodes.length != 0 &&
            removedCallback(
              mutation.removedNodes,
              mutation,
              observer
            );
        }
      }
    );
  }

  observe(targetElement, options) {
    this.observer.observe(targetElement, options);
  }

  disconnect() {
    this.observer.disconnect();
  }
}

export { DOMObserver };
