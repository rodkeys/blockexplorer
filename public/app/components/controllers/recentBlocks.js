'use strict';

angular.module('recentBlocksCtrl', [])
    .controller('recentBlocksController', function($scope, $state, mySocket, blockHistory) {
        blockHistory.getRecentBlocks();
        $scope.recentTestnetBlocks = blockHistory.recentTestnetBlocks;
        $scope.recentSidechainBlocks = blockHistory.recentSidechainBlocks;
        $scope.data = {
            testnetBlocksLoaded: "25",
            sidechainBlocksLoaded: "25",
        };

        $scope.findTestnetBlock = function(data) {
        	data = {type: 'tblock', data: data}
        	  $state.go('tblock', {
                    data: data,
                    url: data.data.result.hash
                })
        }

        $scope.findSidechainBlock = function(data) {
            data = {type: 'sblock', data: data}
            $state.go('sblock', {
                data: data,
                url: data.data.result.hash
            })
        }

        // Check when scrollbar hits bottom and trigger loadMore;
        // Note: move to factory later
        $('#testnetBlocks').on('scroll', function() {
            if ($(this).scrollTop() === ($(this)[0].scrollHeight - $(this).height())) {
                blockHistory.loadMoreTestnetBlocks();
            }
        });

        // Check when scrollbar hits bottom and trigger loadMore;
        // Note: move to factory later
        $('#sidechainBlocks').on('scroll', function() {
            if ($(this).scrollTop() === ($(this)[0].scrollHeight - $(this).height())) {
                blockHistory.loadMoreSidechainBlocks();
            }
        });




        $scope.$watch('data.sidechainBlocksLoaded', function(newValue) {
            blockHistory.getRecentBlocks(newValue)
        });
        $scope.$watch('data.testnetBlocksLoaded', function(newValue) {
            blockHistory.getRecentBlocks(newValue)
        });






    });
