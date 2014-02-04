'use strict';

var Fs = require('fs');
var Path = require('path');
var Util = require('../util');
var Middlewares = {};

Fs.readdirSync(__dirname)
  .filter(function (path) {
    return (path.indexOf('.') !== 0) && (path !== 'index.js') && (path.slice(-3) == '.js');
  })
  .forEach(function (path) {
    // patch for relative path
    path = Path.resolve(__dirname, Path.join(__dirname, path));

    // load middlewares
    var namespace = Util.capitalize(Path.basename(path, '.js'));
    Middlewares[namespace] = require(path);
  });

module.exports = Middlewares;