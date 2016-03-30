/*****************************************
 * AUTHOR : nanyuantingfeng
 * DATE : 3/30/16
 * TIME : 21:06
 ****************************************/
var http = require('http');
var nfix = require('nfix');
var httpRequestForward = require('./forwarder').httpRequestForward;

function createMockerServer(mocker, forward, port) {
  var server = http.createServer((req, res) => {
    var url = req.url.split('?')[0];
    if (mocker.isValid(url)) {
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(nfix.encode(mocker.get(url)));
    } else httpRequestForward(forward + req.url, req, res);
  });
  
  return port ? server.listen(port) : server;
}

function createServer(forward, port) {
  var server = http.createServer((req, res) => {
    httpRequestForward(forward + req.url, req, res);
  });
  return port ? server.listen(port) : server;
}

module.exports.createServer = createServer;
module.exports.createMockerServer = createMockerServer;