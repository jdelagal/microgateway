// sample.js
//
'use strict';

var mg = require('./lib/microgw');
var fs = require('fs');

// config dir
process.env.CONFIG_DIR = __dirname + '/config/definitions/myapp/';
//process.env.CONFIG_DIR = __dirname + '/config/definitions/savings/';
process.env.NODE_ENV = 'production';
mg.start(3000);