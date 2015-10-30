var RpcClient = require('../../config/rpcInterface'),
    config = require('../../config/config'),
    Promise = require('promise');


// Testnet RPC client
var rpc = new RpcClient(config.testnet),
    // Sidechains RPC client
    rpc2 = new RpcClient(config.sidechain),
    testnetTxids = [],
    sidechainTxids = [],
    recentTestnetTransactions = [],
    recentSidechainTransactions = [];



// Track new testnet transactions
exports.trackTestnetTransactions = function showTestnetTransactions(io) {
    rpc.getRawMemPool(function(err, ret) {
        if (err) {
            console.error(err);
            setTimeout(showTestnetTransactions, 10000);
        }

        function batchCall() {
            ret.result.forEach(function(txid) {
                if (testnetTxids.indexOf(txid) === -1) {
                    rpc.getRawTransaction(txid);
                }
            });
        }

        rpc.batch(batchCall, function(err, rawtxs) {
            if (err) {
                console.error(err);
                setTimeout(showTestnetTransactions, 10000);
            }

            rawtxs.map(function(rawtx) {
                rpc.decoderawtransaction(rawtx.result, function(err, result) {
                    if (err) {
                        console.log(err)
                    }
                    io.to('recentTestnetTransactions').emit('newTestnetTransaction', result)
                    if (recentTestnetTransactions.length > 50) {
                        recentTestnetTransactions.pop();
                        recentTestnetTransactions.unshift(result)
                    } else {
                        recentTestnetTransactions.unshift(result)
                    }
                })
            });

            testnetTxids = ret.result;
            setTimeout(showTestnetTransactions(io), 200);
        });
    });
}

// Track new sidechain transactions
exports.trackSidechainTransactions = function showSidechainTransactions(io) {
    rpc2.getRawMemPool(function(err, ret) {
        if (err) {
            console.error(err);
            setTimeout(showSidechainTransactions, 10000);
        }

        function batchCall() {
            ret.result.forEach(function(txid) {
                if (sidechainTxids.indexOf(txid) === -1) {
                    rpc2.getRawTransaction(txid);
                }
            });
        }

        rpc2.batch(batchCall, function(err, rawtxs) {
            if (err) {
                console.error(err);
                setTimeout(showSidechainTransactions, 10000);
            }

            rawtxs.map(function(rawtx) {
                rpc2.decoderawtransaction(rawtx.result, function(err, result) {
                    if (err) {
                        console.log(err)
                    }
                    io.to('recentSidechainTransactions').emit('newSidechainTransaction', result)
                    if (recentSidechainTransactions.length > 50) {
                        recentSidechainTransactions.pop();
                        recentSidechainTransactions.unshift(result)
                    } else {
                        recentSidechainTransactions.unshift(result)
                    }
                })
            });

            sidechainTxids = ret.result;
            setTimeout(showSidechainTransactions(io), 200);
        });
    });
}


// Note: Messy, refactor ASAP
exports.searchBlocks = function(io, socket, data) {
    var promise = new Promise(function(resolve, reject) {
            if (data.searchInput && data.searchInput.length === 64) {
                if (/^0{8}/.test(data.searchInput)) {
                    rpc.getblock(data.searchInput, function(err, result) {
                        if (err) {
                            if (err.code === -5) {
                                sidechainSearch(data);
                            } else {
                                reject(err)
                            }
                        }
                        var response = {
                            type: 'tblock',
                            data: result,
                        }
                        resolve(response)
                    });
                } else {
                    // Assumes TXID
                    rpc.getrawtransaction(data.searchInput, 1, function(err, result) {
                        if (err) {
                            if (err.code === -5) {
                                sidechainSearch(data);
                            } else {
                                reject(err)
                            }
                        } else {
                            var response = {
                                type: 'tTransaction',
                                data: result,
                            }
                            resolve(response)
                        }
                    });
                }
            } else {
                io.to(socket.id).emit('unknownTransaction', data);
            }

            function sidechainSearch(data) {
                rpc2.getblock(data.searchInput, function(err, result) {
                    if (err) {
                        if (err.code === -5) {
                            rpc2.getrawtransaction(data.searchInput, 1, function(err, result) {
                                if (err) {
                                    if (err.code === -5) {
                                        io.to(socket.id).emit('unknownTransaction', data);
                                    } else {
                                        reject(err)
                                    }
                                } else {
                                    var response = {
                                        type: 'sTransaction',
                                        data: result,
                                    }
                                    resolve(response)
                                }
                            });

                        } else {
                            reject(err)
                        }
                    } else {
                        var response = {
                            type: 'sblock',
                            data: result,
                        }
                        resolve(response)
                    }
                });
            }
        })
        .then(function(data) {
            io.to(socket.id).emit('searchResponse', data);
        })
        .catch(function(err) {
            console.log(err);
        })
};

exports.getRecentTestnetBlocks = function(io, socket, data) {
    var recentBlocks = [];
    var blocksLoaded = 25;
    if (data && data <= 200) {
        blocksLoaded = data
    }
    rpc.getBlockCount(function(err, blockIndex) {
        if (err) {
            console.log(err)
        }
        for (var i = 0; i < blocksLoaded; i++) {
            rpc.getblockhash(blockIndex.result - i, function(err, hash) {
                if (err) {
                    console.log(err)
                }
                rpc.getblock(hash.result, function(err, block) {
                    recentBlocks.push(block)
                    if (recentBlocks.length == blocksLoaded) {
                        io.to(socket.id).emit('recentTestnetBlocks', recentBlocks);
                    }
                });
            });
        }

    });
}

exports.getRecentSidechainBlocks = function(io, socket, data) {
    var recentBlocks = [];
    var blocksLoaded = 25;
    if (data && data <= 200) {
        blocksLoaded = data
    }
    rpc2.getBlockCount(function(err, blockIndex) {
        if (err) {
            console.log(err)
        }
        for (var i = 0; i < blocksLoaded; i++) {
            rpc2.getblockhash(blockIndex.result - i, function(err, hash) {
                if (err) {
                    console.log(err)
                }
                rpc2.getblock(hash.result, function(err, block) {
                    recentBlocks.push(block)
                    if (recentBlocks.length == blocksLoaded) {
                        io.to(socket.id).emit('recentSidechainBlocks', recentBlocks);
                    }
                });
            });
        }

    });
}


// Load more testnet blocks for infinite scrolling
exports.loadMoreTestnetBlocks = function(io, socket, data) {
    var loadMoreBlocks = [];
    if (data && data.result) {
        for (var i = 0; i < 30; i++) {
            lastBlock = data.result.height - 1;
            rpc.getblockhash(lastBlock - i, function(err, hash) {
                if (err) {
                    console.log(err)
                }
                rpc.getblock(hash.result, function(err, block) {
                    loadMoreBlocks.push(block)
                    if (loadMoreBlocks.length == 30) {
                        io.to(socket.id).emit('loadMoreTestnetBlocks', loadMoreBlocks);
                    }
                });
            });
        }
    }
};

// Load more blocks for infinite scrolling
exports.loadMoreSidechainBlocks = function(io, socket, data) {
    var loadMoreBlocks = [];
    if (data && data.result) {
        for (var i = 0; i < 30; i++) {
            lastBlock = data.result.height - 1;
            rpc2.getblockhash(lastBlock - i, function(err, hash) {
                if (err) {
                    console.log(err)
                }
                rpc2.getblock(hash.result, function(err, block) {
                    loadMoreBlocks.push(block)
                    if (loadMoreBlocks.length == 30) {
                        io.to(socket.id).emit('loadMoreSidechainBlocks', loadMoreBlocks);
                    }
                });
            });
        }
    }
};

// Send recent transactions to socket connection
exports.getRecentTransactions = function(io, socket) {
    socket.join('recentTestnetTransactions')
    socket.join('recentSidechainTransactions')
        // Return last 15 transactions
    io.to(socket.id).emit('recentTestnetTransactions', recentTestnetTransactions.slice(0, 25));
    io.to(socket.id).emit('recentSidechainTransactions', recentSidechainTransactions.slice(0, 25));
}
