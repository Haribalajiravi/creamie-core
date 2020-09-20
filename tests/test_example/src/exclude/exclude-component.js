import Creamie from '../../../../creamie.js';
import ExcludeConfig from './exclude-config.js';
export default class Exclude extends Creamie {
  constructor() {
    super(ExcludeConfig);
    console.info('Exclude worked!');
  }
}
window.customElements.define(ExcludeConfig.tag, Exclude);
