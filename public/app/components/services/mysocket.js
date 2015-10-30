/* global io */
'use strict';

angular.module('mysocketService', [])
  .factory('mySocket', function(socketFactory, $location) {
    var sendRoom = $location.path().slice(2);
    var host = location.host;
    var socket = io.connect(host, { query: "room=" + sendRoom});

    var wrappedSocket = socketFactory({
      ioSocket: socket
    });

    wrappedSocket.reconnect = function() {
      if(socket.io.connected) {
        socket.io.disconnect();
        socket.io.connect();
      } else {
        socket.io.connect();
      }
    };

    wrappedSocket.disconnect = function() {
      socket.io.disconnect();
    };

    wrappedSocket.connect = function() {
      socket.io.connect();
    };

    return wrappedSocket;
  });
