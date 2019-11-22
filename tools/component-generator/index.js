const fs = require('fs');
const Utils = require('./../../utils/Utils');
const Js = require('./component/component-js');
const Html = require('./component/component-html');
const Css = require('./component/component-css');
const Config = require('./component/component-config');
const ComponentGenerator = require('./component-generator');

/**
 * To Generate component files
 * @param {string} name 
 * @param {string} option 
 */
const componentGenerator = (name, option) => {
    new ComponentGenerator(name, option, [Js, Html, Css, Config]).start();

    /**
     * Import components to index.js
     */
    let path = `./${name}/${name}-component`;
    fs.appendFile('src/index.js', `\r\nimport ${Utils.capitalize(name)} from '${path}'`, function(err) {
        if (err) throw err;
        console.log(`index.js modified!`);
        console.log(`${path} imported!`);
    });
}

module.exports = componentGenerator