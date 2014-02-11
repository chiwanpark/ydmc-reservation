'use strict';

var Messages = require('../messages');
var Middlewares = require('../middlewares');
var Preference = {};
var nconf = require('nconf');

nconf.file({file: 'preferences.json', dir: '../'});

Preference.registerRoute = function (app) {
  app.get('/preferences', Middlewares.Auth.requireLogged, Preference.get);
  app.post('/preferences', Middlewares.Auth.requireAdmin, Preference.post);
};

Preference.get = function (request, response) {
  response.json({success: true, preferences: {
    notice: nconf.get('notice'),
    available: nconf.get('available')
  }});
};

Preference.post = function (request, response) {
  var available = request.body.available === 'true';
  var notice = request.body.notice || '';

  nconf.set('available', available);
  nconf.set('notice', notice);

  nconf.save(function (error) {
    if (error) {
      response.json({success: false, message: Messages.savePreferencesFailed});
    } else {
      response.json({success: true, message: Messages.savePreferencesSuccess});
    }
  })
};

module.exports = Preference;