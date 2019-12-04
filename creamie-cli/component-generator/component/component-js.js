const Utils = require('./../../utils/Utils');

var JS = {
    get: (name) => {
        let capName = Utils.capitalize(name);
        return {
            filename: `${name}-component.js`,
            content: `import Creamie from 'creamie';
import ${capName}Config from './${name}-config';
export default class ${capName} extends Creamie {
    constructor() { 
        super(${capName}Config);
        console.info('${name} worked!');
    }
}
window.customElements.define(${capName}Config.tag, ${capName});`
        }
    }
}

module.exports = JS;