import TextField from './plugins/textfield';
import Select from './plugins/select';

class PluginConnector {

    constructor({
        scopes,
        dataCache,
        excludePlugins
    }) {
        this.scopes = scopes;
        this.dataCache = dataCache;
        this.excludePlugins = (Array.isArray(excludePlugins) && excludePlugins.length) ? excludePlugins : [];
        this.plugins = [
            new TextField(),
            new Select()
        ];
        this.matchedCache = {
            getter: {},
            setter: {}
        };
    }

    isMatched({
        element,
        property,
        type,
        currentValue,
        oldValue }) {
        let matchUpObj = {
            element: element,
            scopes: this.scopes,
            property: property,
            dataCache: this.dataCache,
            currentValue: currentValue,
            oldValue: oldValue
        };
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

    getter() {
        let elementGetter = this.matchedCache.getter;
        elementGetter.plugin.get({
            element: elementGetter.element,
            scopes: elementGetter.scopes,
            property: elementGetter.property,
            dataCache: elementGetter.dataCache
        });
    }

    setter() {
        let elementSetter = this.matchedCache.setter;
        elementSetter.plugin.set({
            element: elementSetter.element,
            currentValue: elementSetter.currentValue,
            scopes: elementSetter.scopes,
            property: elementSetter.property,
            dataCache: elementSetter.dataCache,
            currentValue: elementSetter.currentValue,
            oldValue: elementSetter.oldValue,
        });
    }

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

    destroyer() {
        let elementDestroyer = this.matchedCache.getter;
        elementDestroyer.plugin.destroy({
            element: elementDestroyer.element,
            scopes: elementDestroyer.scopes,
            dataCache: elementDestroyer.dataCache,
            property: elementDestroyer.property
        });
    }
}

export default PluginConnector;