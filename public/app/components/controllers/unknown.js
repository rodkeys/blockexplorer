'use strict';

angular.module('unknownCtrl', [])
    .controller('unknownController', function($scope, $state, $stateParams) {
        if ($stateParams) {
            if ($stateParams.data) {
                $scope.searchInfo = $stateParams.data.searchInput;
            }
            else if ($stateParams.url) {
                $scope.searchInfo = $stateParams.url;
            }
        }
    })
