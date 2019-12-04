const fs = require('fs');
const path = require('path');
const Utils = {
    capitalize: (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
}

module.exports = Utils;