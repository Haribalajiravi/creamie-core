const Js = require('./component/component-js.js');
const Html = require('./component/component-html.js');
const Css = require('./component/component-css.js');
const Config = require('./component/component-config.js');
const ComponentGenerator =  require('./ComponentGenerator.js');

const componentGenerator = (name, option) => {
    new ComponentGenerator(name, option, [Js, Html, Css, Config]).start();
}

module.exports = componentGenerator