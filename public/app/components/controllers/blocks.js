'use strict';

angular.module('blockCtrl', [])
    .controller('blockController', function($scope, $stateParams, mySocket, searchExplorer) {


        if ($stateParams.data) {
            $scope.block = $stateParams.data.data.result;
            $scope.blockCount = $scope.block.tx.length;
            $scope.blockSize = (Number($scope.block.size) / 1024).toFixed(2);
        } else {
            searchExplorer.search({
                searchInput: $stateParams.url
            })
        }

    });
