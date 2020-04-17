export default class TextField {

    get({
        element,
        scopes,
        property,
        dataCache
    }) {
        let eventController = () => {
            scopes[property] = element.value;
        }
        element.addEventListener('keyup', eventController, true);
        dataCache[property] = {
            event: 'keyup',
            method: eventController
        };
    }

    set({
        element,
        currentValue
    }) {
        element.value = currentValue;
    }

    isMatched({ element }) {
        return {
            getter: (element.type && (element.type === 'text' || element.type === 'textarea')) ? true : false,
            setter: (element.type && (element.type === 'text' || element.type === 'textarea')) ? true : false
        }
    }

    destroy({
        element,
        dataCache
    }) {
        element.removeEventListener(dataCache.event, dataCache.method);
    }
}