import DOMRememberer from './../domrememberer.js';

export default class If {

    constructor() {
        this.domCache = {};
        this.remember = undefined;
    }

    get({
        element,
        scopes,
        property
    }) {
        /**
         * Register element to DOMRememberer to insert and remove
         */
        this.remember = new DOMRememberer(element);
    }

    /**
     * It will get the new value from object and set it to the synced select
     * @param {object} param0
     * element, [current DOM element]
     * currentValue, [assigned value with respect to the object's property]
     * property, [Attribute value of if]
     */
    set({
        element,
        currentValue,
        property
    }) {
        if(typeof currentValue == 'boolean') {
            if(currentValue) {
                this.remember.insert();
            } else {
                this.remember.remove();
            }
        } else {
            throw `${property} should be boolean type.`
        }
    }

    /**
     * It will return object which contains the boolean value of getter, setter conditional statement
     * @param {object} param0 
     * element [current DOM element]
     */
    isMatched({
        element,
        currentValue
    }) {
        return {
            getter: (element.hasAttribute('if')) ? true : false,
            setter: (element.hasAttribute('if') && typeof currentValue == 'boolean') ? true : false
        }
    }

}