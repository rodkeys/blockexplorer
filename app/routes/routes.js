'use strict';

    var index = require('../controllers');

/**
 * Application routes
 */
module.exports = function(app) {
    //Note: Include REST API later
    app.get('/*', index.index);

};
