'use strict';

var Messages = require('../messages');

var Auth = {};

Auth.requireLogged = function (request, response, next) {
  if (request.session.user) {
    next();
  } else {
    response.json({success: false, message: Messages.unauthorized});
  }
};

Auth.requireAdmin = function (request, response, next) {
  Auth.requireLogged(request, response, function() {
    if (request.session.user.admin) {
      next();
    } else {
      response.json({success: false, message: Messages.unauthorized});
    }
  });
};

module.exports = Auth;