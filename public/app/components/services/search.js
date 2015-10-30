'use strict';
angular.module('searchService', [])
    .factory('searchExplorer', function(mySocket, $rootScope, $state) {
        var searchInput;
        

        mySocket.on('searchResponse', function(data) {
            if (searchInput) {
                $state.go(data.type, {
                    data: data,
                    url: searchInput
                })
            }
        });

        mySocket.on('unknownTransaction', function(data) {
                $state.go('unknownTransaction', {
                    data: data,
                    url: data.searchInput
                })
        });



        // Public API here
        return {
            // Send explorer search request to server
            search: function(formInput) {
                searchInput = formInput.searchInput;
                mySocket.emit('searchBlocks', formInput);
            },
        };
    })
