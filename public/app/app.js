'use strict';

angular.module('blockExplorer', [
    'app.routes',
    'btford.socket-io',
    'defaultCtrl',
    'blockCtrl',
    'transactionCtrl',
    'searchCtrl',
    'mysocketService',
    'searchService',
    'recentBlocksCtrl',
    'recentTransactionsCtrl',
    'blockHistoryService',
    'unknownCtrl'
])

.config(function($httpProvider, $locationProvider) {

        // Intercept 401s and redirect you to login
        $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
            return {
                'responseError': function(response) {
                    if (response.status === 401) {
                        return $q.reject(response);
                    } else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    })
    .run(function($rootScope, $location) {
        // Redirect to login if route requires auth and you're not logged in
    });
