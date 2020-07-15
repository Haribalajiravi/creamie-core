/**
 * This class will remember the DOM. 
 * It will disconnect the DOM and connect it back at the same position.
 */
export default class DOMRememberer {
    constructor(current) {
        this.current = current;
        this.parent = this.current.parentNode;
        this.next = this.current.nextSibling;
    }

    remove() {
        this.current.remove();
    }

    insert() {
        if(this.next) {
            this.parent.insertBefore(this.current, this.next);
        } else {
            this.parent.appendChild(this.current);
        }
    }
}