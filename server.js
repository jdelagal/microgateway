// sample.js
//
'use strict';
/*
var supertest = require('supertest');
var echo = require('./test/support/echo-server');
var apimServer = require('./test/support/mock-apim-server/apim-server');
var dsCleanup = require('./test/support/utils').dsCleanup;
var dsCleanupFile = require('./test/support/utils').dsCleanupFile;
var resetLimiterCache = require('./lib/rate-limit/util').resetLimiterCache;
*/


var mg = require('./lib/microgw');
// config dir

//process.env.CONFIG_DIR = __dirname + '/config/definitions/myapp/combined1';
process.env.CONFIG_DIR = __dirname + '/config/definitions/myapp';
process.env.NODE_ENV = 'production';
mg.start(3000);