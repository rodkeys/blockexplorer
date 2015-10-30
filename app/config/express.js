'use strict';

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    rootPath = path.normalize(__dirname + '/../..');



var init = function(app) {


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.set('views', rootPath + '/public/app');
    app.use(express.static(path.join(rootPath, 'public'))); // Where the server serves files


    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    // Log all requests to the console
    app.use(morgan('dev'));


};

module.exports = {
    init: init
};
