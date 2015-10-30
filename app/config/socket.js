var express = require('express'),
defaultCtrl = require('../controllers/socket/default');

module.exports = function(io, app, expressConfig) {

    defaultCtrl.trackSidechainTransactions(io);
    defaultCtrl.trackTestnetTransactions(io);

    io.sockets.on('connection', function(socket) {

        socket.on('searchBlocks', function(data) {
            defaultCtrl.searchBlocks(io, socket, data)
        });

        socket.on('getRecentBlocks', function(data) {
        	defaultCtrl.getRecentTestnetBlocks(io, socket, data);
            defaultCtrl.getRecentSidechainBlocks(io, socket, data);
        });

        socket.on('loadMoreTestnetBlocks', function(data) {
        	defaultCtrl.loadMoreTestnetBlocks(io, socket, data);
        });
        socket.on('loadMoreSidechainBlocks', function(data) {
            defaultCtrl.loadMoreSidechainBlocks(io, socket, data);
        });


        socket.on('getRecentTransactions', function() {
        	defaultCtrl.getRecentTransactions(io, socket)
        });

    });
};
