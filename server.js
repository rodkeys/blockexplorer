'use strict';

var express = require('express'),
    path = require('path');


var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);



// Express settings
var expressConfig = require('./app/config/express');
expressConfig.init(app);

// Socket.io configuration
require('./app/config/socket')(io, app, expressConfig);

// Routing
require('./app/routes/routes')(app);

// Start server
server.listen(3000, function() {
    console.log('Server Listening on', 3000);
});

// Expose app
exports = module.exports = app;
