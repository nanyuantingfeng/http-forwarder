/*****************************************
 * AUTHOR : nanyuantingfeng
 * DATE : 3/30/16
 * TIME : 21:03
 ****************************************/

module.exports.createServer = require('./server').createServer;
module.exports.createMockerServer = require('./server').createMockerServer;

module.exports.Mocker = require('./mocker');
module.exports.httpRequestForward = require('./forwarder');