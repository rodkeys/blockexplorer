'use strict';
// Controls Private Chat within app
angular.module('blockHistoryService', [])
    .factory('blockHistory', function(mySocket, $rootScope) {
        var recentTestnetBlocks, recentTestnetTransactions, recentSidechainTransactions, recentSidechainBlocks;
        var waitingTestnetTransactions = [];
        var waitingSidechainTransactions = [];

        mySocket.on('loadMoreTestnetBlocks', function(data) {
            if (data) {
                data.sort(function(x, y) {
                    return y.result.height - x.result.height
                });
                for (var i = 0; i < data.length; i++) {
                    recentTestnetBlocks.push(data[i])
                }
                $rootScope.$digest();
            }
        });

        mySocket.on('loadMoreSidechainBlocks', function(data) {
            if (data) {
                data.sort(function(x, y) {
                    return y.result.height - x.result.height
                });
                for (var i = 0; i < data.length; i++) {
                    recentSidechainBlocks.push(data[i])
                }
                $rootScope.$digest();
            }
        });

        mySocket.on('recentTestnetBlocks', function(data) {
            if (data) {
                data.sort(function(x, y) {
                    return x.result.confirmations - y.result.confirmations
                });
                recentTestnetBlocks = data;
            }
        });

        mySocket.on('recentSidechainBlocks', function(data) {
            if (data) {
                data.sort(function(x, y) {
                    return x.result.confirmations - y.result.confirmations
                });
                recentSidechainBlocks = data;
            }
        });

        // Listen for when a new testnet recent transaction appears
        mySocket.on('newTestnetTransaction', function(data) {
            waitingTestnetTransactions.unshift(data);
        });

        // Listen for when a new recent transaction appears
        mySocket.on('newSidechainTransaction', function(data) {
            waitingSidechainTransactions.unshift(data);
        });



        mySocket.on('recentTestnetTransactions', function(data) {
            recentTestnetTransactions = data;
        });

        mySocket.on('recentSidechainTransactions', function(data) {
            recentSidechainTransactions = data;
        });


        // Public API here
        return {
            getRecentBlocks: function(data) {
                if (data) {
                    mySocket.emit('getRecentBlocks', data);
                } else {
                    mySocket.emit('getRecentBlocks');
                }
            },
            getRecentTransactions: function() {
                mySocket.emit('getRecentTransactions');
            },
            recentTestnetBlocks: function() {
                return recentTestnetBlocks;
            },
            recentSidechainBlocks: function() {
                return recentSidechainBlocks;
            },
            recentTestnetTransactions: function() {
                return recentTestnetTransactions;
            },
            recentSidechainTransactions: function() {
                return recentSidechainTransactions;
            },
            clearWaitingNotifications: function() {
                waitingTestnetTransactions.length = 0;
                waitingSidechainTransactions.length = 0;
            },
            waitingTransactions: function(type) {
                if(type === "testnet") {
                    return {notifications: waitingTestnetTransactions};
                }
                else if (type === "sidechain") {
                    return {notifications: waitingSidechainTransactions}
                }
            },
            combineTransactionLists: function(type) {
                if (type === "testnet") {
                    for (var i = 0; i < waitingTestnetTransactions.length; i++) {
                        recentTestnetTransactions.unshift(waitingTestnetTransactions[i])
                    };
                    waitingTestnetTransactions.length = 0;
                }
                else if (type === "sidechain") {
                    for (var i = 0; i < waitingSidechainTransactions.length; i++) {
                        recentSidechainTransactions.unshift(waitingSidechainTransactions[i])
                    };
                    waitingSidechainTransactions.length = 0;
                }
            },
            loadMoreTestnetBlocks: function() {
                var lastBlock = recentTestnetBlocks.length - 1;
                mySocket.emit('loadMoreTestnetBlocks', recentTestnetBlocks[lastBlock]);
            },
            loadMoreSidechainBlocks: function() {
                var lastBlock = recentSidechainBlocks.length - 1;
                mySocket.emit('loadMoreSidechainBlocks', recentSidechainBlocks[lastBlock]);
            },
        };

    })
