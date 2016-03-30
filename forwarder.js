/*****************************************
 * AUTHOR : nanyuantingfeng
 * DATE : 3/30/16
 * TIME : 21:05
 ****************************************/

/*****************************************
 * AUTHOR : nanyuantingfeng
 * DATE : 3/26/16
 * TIME : 01:06
 ****************************************/
var formatQueryString = require('querystring').stringify;
var httpRequest = require('http').request;
var httpsRequest = require('https').request;
var parseUrl = require('url').parse;
var nfix = require('nfix');


var DEFAULTS = {
  headers:{
    connection:'close'
  }
};
var HTTP_RE = /^http(s?):?$/;

function normalizeOptions(opts) {
  
  opts = nfix.isString(opts) ? parseUrl(opts) : nfix.deepClone(opts);
  
  nfix.deepMerge(opts, DEFAULTS);
  
  if (!opts.path) {
    var path = opts.pathname || '/';
    
    var query;
    
    if (opts.search) {
      path += opts.search
    } else if ((query = opts.query)) {
      if (!nfix.isString(query)) {
        query = formatQueryString(query)
      }
      path += '?' + query
    }
    
    opts.path = path
  }
  
  var matches;
  
  opts.secure = !!(  opts.protocol && (matches = opts.protocol.match(HTTP_RE)) && matches[1]);
  
  delete opts.protocol;
  
  return opts
}

function httpRequestForward(opts, iRequest, oResponse) {
  
  opts = normalizeOptions(opts);
  
  if (!opts.method) opts.method = iRequest.method;
  
  nfix.deepMerge(opts, {headers:{host:opts.hostname || opts.host}}, {headers:iRequest.headers});
  
  var request = opts.secure ? httpsRequest : httpRequest;
  
  var oRequest = request(opts, function (downRes) {
    
    oResponse.writeHead(downRes.statusCode, downRes.statusMessage || '', downRes.headers);
    
    downRes.pipe(oResponse);
    
    downRes.on('error', error => oResponse.emit('error', error))
  });
  
  iRequest.pipe(oRequest);
  
  oRequest.on('error', error => iRequest.emit('error', error));
  
  iRequest.on('close', _ => oRequest.abort())
}

module.exports = httpRequestForward.httpRequestForward = httpRequestForward;
