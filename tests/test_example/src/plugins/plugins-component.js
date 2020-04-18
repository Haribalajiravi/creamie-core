import Creamie from './../../../../creamie.js';
import PluginsConfig from './plugins-config.js';
export default class Plugins extends Creamie {
    constructor() { 
        super(PluginsConfig);
        console.info('plugins worked!');
    }
}
window.customElements.define(PluginsConfig.tag, Plugins);