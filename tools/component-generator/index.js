const Js = require('./component/component-js');
const Html = require('./component/component-html');
const Css = require('./component/component-css');
const Config = require('./component/component-config');
const ComponentGenerator =  require('./componentGenerator');

const componentGenerator = (name, option) => {
    new ComponentGenerator(name, option, [Js, Html, Css, Config]).start();
}

module.exports = componentGenerator