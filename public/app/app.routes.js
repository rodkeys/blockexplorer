angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
    //  $urlRouterProvider.otherwise("/");
    $stateProvider

        .state('home', {
            url: '/',
            templateUrl: 'app/components/views/root.html',
            params: {
                data: null
            },
            controller: 'defaultController'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'app/components/views/about.html',
        })
        .state('tblock', {
            url: '/tblock/:url',
            templateUrl: 'app/components/views/testnetBlocks.html',
            params: {
                data: null
            },
            controller: 'blockController'
        })
        .state('sblock', {
            url: '/sblock/:url',
            templateUrl: 'app/components/views/sidechainBlocks.html',
            params: {
                data: null
            },
            controller: 'blockController'
        })
        .state('tTransaction', {
            url: '/tTXID/:url',
            templateUrl: 'app/components/views/testnetTransactions.html',
            params: {
                data: null
            },
            controller: 'transactionController'
        })
        .state('sTransaction', {
            url: '/sTXID/:url',
            templateUrl: 'app/components/views/sidechainTransactions.html',
            params: {
                data: null
            },
            controller: 'transactionController'
        })
        .state('unknownTransaction', {
            url: '/search/unknown/:url',
            templateUrl: 'app/components/views/unknownTransaction.html',
            params: {
                data: null
            },
            controller: 'unknownController'
        })
        .state('recentTransactions', {
            url: '/recent/transactions',
            templateUrl: 'app/components/views/recentTransactions.html',
            params: {
                data: null
            },
            controller: 'recentTransactionsController'
        })
        .state('recentBlocks', {
            url: '/recent/blocks',
            templateUrl: 'app/components/views/recentBlocks.html',
            params: {
                data: null
            },
            controller: 'recentBlocksController'
        })

    $locationProvider.html5Mode(true);

});
