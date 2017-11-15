// © Copyright IBM Corporation 2016,2017.
// Node module: microgateway
// LICENSE: Apache 2.0, https://www.apache.org/licenses/LICENSE-2.0

'use strict';
var _ = require('lodash');
var url = require('url');
var qs = require('qs');
var zlib = require('zlib');
var dsc = require('microgateway-datastore/client/index.js');
var fetch = require('node-fetch');
/// /one-time effort: read the cipher table into memory
// var cipherTable;
// try {
//  //the mapping table of TLS to OpenSSL ciphersuites
//  cipherTable = require(__dirname + '/../../lib/cipher-suites.json');
// }
// catch (err) {
//  logger.error('Warning! Cannot read the cipher table for invoke policy. %s',
//          err);
//  cipherTable = {};
// }

/**
 * Do the real work of the invoke policy: read the property and decide the
 * parameters, establish the connection after everything is ready.
 */
function _main(props, context, next, logger, writeDst, tlsProfile) {
  return fetch('http://192.168.99.1:8089/archibus/cxf/ReservesRm')
  .then(res => res.json())
}

/**
 * The entry point of the invoke policy.
 * Read the TLS profile first and do the real work then.
 */
function invoke(props, context, flow) {
  var logger = flow.logger;

  // writeDst: first thing, decide where to write the response
  if (context.message === undefined) {
    context.message = {}; // In fact, this should never happen
  }
  var writeDst = context.message;
 _main(props, context, null, logger, writeDst);
  
}

module.exports = function(config) {
  return invoke;
};

/*
 * return query string from url
 */
function maskQueryStringInURL(url) {
  url = url || '';
  return url.replace(/\?.*?$/, '');
}
