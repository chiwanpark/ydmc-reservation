'use strict';

var Fs = require('fs');
var Path = require('path');
var Routes = {};

Fs.readdirSync(__dirname)
  .filter(function (path) {
    return (path.indexOf('.') !== 0) && (path !== 'index.js') && (path.slice(-3) == '.js');
  })
  .forEach(function (path) {
    // patch for relative path
    path = Path.resolve(__dirname, Path.join(__dirname, path));

    // load model
    Routes[path.substring(0, path.length - 3)] = require(path);
  });

module.exports = Routes;