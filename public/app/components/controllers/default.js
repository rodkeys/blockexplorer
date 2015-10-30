'use strict';

angular.module('defaultCtrl', [])
    .controller('defaultController', function($scope, $state, $stateParams, mySocket, searchExplorer) {

        $scope.searchMessage = 'Block hash, TXID, Address, etc';
        var addressTest = new RegExp("^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$");
        $scope.$watch('searchInput', function(newValue) {
            if (newValue && newValue.length === 64) {
                if (/^0{8}/.test(newValue)) {
                    $scope.typeMessage = 'Bitcoin Block Hash'
                } else {
                    $scope.typeMessage = 'SHA-256 Hash';
                }
            } else if (addressTest.test(newValue)) {
                $scope.typeMessage = 'Bitcoin Address'
            } else if (newValue && newValue.length === 0) {
                $scope.typeMessage = ''
            } else {
                $scope.typeMessage = 'Unknown Search Type'
            }
        });

        $scope.searchExplorer = function() {
            searchExplorer.search({
                searchInput: $scope.searchInput
            })
        }


    });
