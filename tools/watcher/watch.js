var watch = require('node-watch');
var VarConfig = require('./watcher-config.js');
var avoidEventFlag = 0;

var avoidMultipleEvents = function () {
    avoidEventFlag = avoidEventFlag ^ 1;
}

var watcher = function() {
    VarConfig.generate();
    watch('src', {
        recursive: true
    }, function (event, filename) {
        if (!avoidEventFlag && /\.(html|css)$/.test(filename)) {
            if (filename) {
                console.log(`${filename} modified!`);
                VarConfig.generate();
            }
        }
        avoidMultipleEvents();
    });
};

module.exports = watcher;