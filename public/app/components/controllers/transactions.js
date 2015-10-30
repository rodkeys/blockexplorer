'use strict';

angular.module('transactionCtrl', [])
    .controller('transactionController', function($scope, $state, $stateParams, mySocket, searchExplorer) {
        if ($stateParams.data) {
            $scope.transaction = $stateParams.data.data.result;
            $scope.transactionInputs = $scope.transaction.vin;
            $scope.transactionOutputs = $scope.transaction.vout;
            if ($scope.transactionInputs[0].coinbase) {
                $scope.coinbaseStatus = true;
            }
            else if (!$scope.transaction.confirmations) {
                $scope.unconfirmedTransaction = true;
            }
        } else {
            searchExplorer.search({
                searchInput: $stateParams.url
            })
        }
    });
