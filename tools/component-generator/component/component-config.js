var Config = {
    get: (name) => {
        return {
            filename: `${name}-config.js`,
            content: `export default {
    template: \`${name.toLowerCase()}-component.html\`,
    style: \`${name.toLowerCase()}-component.css\`,
    tag: \'${name.toLowerCase()}-component\',
    isShadowDom: false,
    shadowMode: 'open',
    binder: 'data'
}`
        }
    }
}

module.exports = Config;