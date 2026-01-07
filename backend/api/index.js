const path = require('path');

let app;
try {
    const serverModule = require(path.join(__dirname, '..', 'server'));
    app = serverModule.app;
} catch (e) {
    app = require('../server').app;
}

module.exports = app;
