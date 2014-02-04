'use strict';

var _ = require('lodash');
var Crypto = require('crypto');

var Util = {};

Util.capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

Util.hash = function (args) {
  var hasher = Crypto.createHash('sha1');

  if (_.isArray(args)) {
    _.forEach(args, function(value) {
      hasher.update(value);
    });
  } else {
    hasher.update(args);
  }

  return hasher.digest('base64');
};

module.exports = Util;