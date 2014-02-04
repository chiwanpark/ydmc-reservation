'use strict';

var Fs = require('fs');
var Path = require('path');
var Util = require('../util');
var Routes = {};

Fs.readdirSync(__dirname)
  .filter(function (path) {
    return (path.indexOf('.') !== 0) && (path !== 'index.js') && (path.slice(-3) == '.js');
  })
  .forEach(function (path) {
    // patch for relative path
    path = Path.resolve(__dirname, Path.join(__dirname, path));

    // load model
    var namespace = Util.capitalize(path.substring(0, path.length - 3));
    Routes[namespace] = require(path);
  });

module.exports = Routes;