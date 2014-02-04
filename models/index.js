'use strict';

var Fs = require('fs');
var Path = require('path');
var mongoose = require('mongoose');

var Models = {};

mongoose.connect('mongodb://localhost/ydmc');

Fs.readdirSync(__dirname)
  .filter(function (path) {
    return (path.indexOf('.') !== 0) && (path !== 'index.js') && (path.slice(-3) == '.js');
  })
  .forEach(function (path) {
    // patch for relative path
    path = Path.resolve(__dirname, Path.join(__dirname, path));

    // load model
    var model = require(path)(mongoose);
    Models[model.modelName] = model;
  });

module.exports = Models;
