'use strict';

var Util = require('../util');

module.exports = function (mongoose) {
  // user schema
  var schema = mongoose.Schema({
    teacherName: String,
    email: String,
    password: String,
    schoolName: String,
    admin: Boolean,
    verified: Boolean
  });

  // setter for password (encryption)
  schema.path('password').set(function (value) {
    return Util.hash(value);
  });

  // verify method for password
  schema.methods.verifyPassword = function(value) {
    return Util.hash(value) == this.password;
  };

  return mongoose.model('User', schema);
};