export default class Select {

    get({
        element,
        scopes,
        property,
        dataCache
    }) {
        let eventController = () => {
            scopes[property] = element.value;
        }
        element.addEventListener('change', eventController, true);
        dataCache[property] = {
            event: 'change',
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
            getter: (element.type && element.type == 'select-one') ? true : false,
            setter: (element.type && element.type == 'select-one') ? true : false
        }
    }

    destroy({
        element,
        dataCache
    }) {
        element.removeEventListener(dataCache.event, dataCache.method);
    }
}