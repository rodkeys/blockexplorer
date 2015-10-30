'use strict';

angular.module('recentTransactionsCtrl', [])
    .controller('recentTransactionsController', function($scope, $state, mySocket, blockHistory) {
        $scope.initPage = function() {
            blockHistory.clearWaitingNotifications();
        }
        blockHistory.getRecentTransactions();
        $scope.recentTestnetTransactions = blockHistory.recentTestnetTransactions;
        $scope.recentSidechainTransactions = blockHistory.recentSidechainTransactions;


        $scope.findTransaction = function(data, type) {
            data = {
                type: type,
                data: data
            }
            $state.go(type, {
                data: data,
                url: data.data.result.txid
            })
        }

        $scope.refreshTransactions = function(type) {
            blockHistory.combineTransactionLists(type);
        }

        $scope.testnetNotifications = blockHistory.waitingTransactions('testnet');
        $scope.sidechainNotifications = blockHistory.waitingTransactions('sidechain');


        // Check if there are waiting testnet notifications
        $scope.refreshTestnetNotifications = function() {
            if ($scope.testnetNotifications.notifications.length > 0) {
                return true
            } else {
                return false;
            }
        }

        // Check if there are waiting sidechain notifications
        $scope.refreshSidechainNotifications = function() {
            if ($scope.sidechainNotifications.notifications.length > 0) {
                return true
            } else {
                return false;
            }
        }


    });
