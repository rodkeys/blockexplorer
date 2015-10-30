'use strict';

angular.module('searchCtrl', [])
    .controller('searchController', function($scope, mySocket, searchExplorer, $state, $stateParams) {
    	 $scope.searchExplorer = function() {
    	 	searchExplorer.search({searchInput: $scope.searchInput})
    	 }
        });