import If from './plugins/if.js';
import Loop from './plugins/loop.js';
import TextField from './plugins/textfield.js';
import Select from './plugins/select.js';

class PluginConnector {
  /**
   * Constructor to initialize all required members
   * @param {object} param0
   * scopes, [refferenced object to map with DOM]
   * dataCache, [extra data source to maintain operations and destroy in future]
   * excludePlugins, [Default plugin classes to neglect while binding]
   */
  constructor({ scopes, dataCache, excludePlugins }) {
    this.scopes = scopes;
    this.dataCache = dataCache;
    this.excludePlugins =
      Array.isArray(excludePlugins) && excludePlugins.length
        ? excludePlugins
        : [];
    this.plugins = [
      new If(),
      new Loop(),
      new TextField(),
      new Select(),
    ];
    this.matchedCache = {
      getter: {},
      setter: {},
    };
  }

  /**
   * It will return a boolean if element match with plugin conditions
   * @param {object} param0
   * element, [current DOM element]
   * property, [binded object's key]
   * type, [string have getter, setter action]
   * currentValue [assigned value with respect to the object's property],
   * oldValue [value before currentValue]
   */
  isMatched({
    element,
    property,
    type,
    currentValue,
    attribute,
    oldValue,
  }) {
    let matchUpObj = {
      element: element,
      scopes: this.scopes,
      property: property,
      dataCache: this.dataCache,
      currentValue: currentValue,
      oldValue: oldValue,
      attribute: attribute,
    };
    // Exclude all given default plugins if anything have
    let intersectedPlugins = this.pluginIntersector();
    for (let i = 0; i < intersectedPlugins.length; i++) {
      let plugin = intersectedPlugins[i];
      let condition = plugin.isMatched(matchUpObj)[type];
      if (typeof condition == 'boolean' && condition === true) {
        matchUpObj.plugin = plugin;
        this.matchedCache[type] = matchUpObj;
        return true;
      }
    }
    return false;
  }

  /**
   * It will execute the matched plugin's getter method
   */
  getter() {
    let elementGetter = this.matchedCache.getter;
    elementGetter.plugin.get({
      element: elementGetter.element,
      scopes: elementGetter.scopes,
      property: elementGetter.property,
      dataCache: elementGetter.dataCache,
    });
  }

  /**
   * It will execute the matched plugin's setter method
   */
  setter() {
    let elementSetter = this.matchedCache.setter;
    elementSetter.plugin.set({
      element: elementSetter.element,
      currentValue: elementSetter.currentValue,
      scopes: elementSetter.scopes,
      property: elementSetter.property,
      dataCache: elementSetter.dataCache,
      oldValue: elementSetter.oldValue,
    });
  }

  /**
   * It will exclude the given default plugin from conditional ladder
   */
  pluginIntersector() {
    let weakMap = new WeakMap();
    let intersectedPlugins = [];
    try {
      this.excludePlugins.forEach((excludePlugin, index) => {
        weakMap.set(excludePlugin, index);
      });
      this.plugins.forEach((plugin) => {
        if (!weakMap.has(plugin.constructor)) {
          intersectedPlugins.push(plugin);
        }
      });
    } catch (error) {
      intersectedPlugins = this.plugins;
      throw error;
    }
    return intersectedPlugins;
  }

  /**
   * It will collect the methods to perform it at component's disconnected callback
   */
  destroyer() {
    let elementDestroyer = this.matchedCache.getter;
    elementDestroyer.plugin.destroy({
      element: elementDestroyer.element,
      scopes: elementDestroyer.scopes,
      dataCache: elementDestroyer.dataCache,
      property: elementDestroyer.property,
    });
  }
}

export default PluginConnector;
