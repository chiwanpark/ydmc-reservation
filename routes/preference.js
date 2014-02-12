'use strict';

var Models = require('../models');
var Messages = require('../messages');
var Middlewares = require('../middlewares');
var Preference = {};
var Fs = require('fs');
var Path = require('path');
var nconf = require('nconf');

nconf.file({file: 'preferences.json', dir: '../'});

Preference.registerRoute = function (app) {
  app.get('/preferences', Middlewares.Auth.requireLogged, Preference.get);
  app.delete('/preferences/delete', Middlewares.Auth.requireAdmin, Preference.deleteAll);
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

Preference.deleteAll = function (request, response) {
  var query = Models.Book.remove({});
  query.exec().then(function () {
    var subQuery = Models.Comment.remove({});
    subQuery.exec().then(function () {
      var subQuery2 = Models.File.remove({});
      subQuery2.exec().then(function () {
        var subQuery3 = Models.Holiday.remove({});
        subQuery3.exec().then(function () {
          var subQuery4 = Models.User.remove({});
          subQuery4.exec().then(function () {
            var subQuery5 = Models.WorkingDay.remove({});
            subQuery5.exec().then(function () {
              var user = new Models.User({
                teacherName: 'YDMC',
                password: 'ydmc',
                phone: '000-000-0000',
                email: 'ydmc@ydmc.co.kr',
                schoolName: '연세대학교',
                admin: true,
                verified: true
              });

              user.save(function (error) {
                if (error) {
                  response.json({success: false, message: Messages.errorOnDatabase});
                } else {
                  Fs.readdirSync(Path.join(__dirname, '../files'))
                    .forEach(function (path) {
                      // patch for relative path
                      path = Path.resolve(__dirname, Path.join(__dirname, '../files', path));

                      Fs.unlinkSync(path);
                    });

                  nconf.set('notice', '');
                  nconf.set('available', false);
                  nconf.save(function (error) {
                    if (error) {
                      response.json({success: false, message: Messages.savePreferencesFailed});
                    } else {
                      response.json({success: true, message: Messages.initializeSystemSuccess});
                    }
                  });
                }
              });
            }, function () {
              response.json({success: false, message: Messages.initializeSystemFailed});
            });
          }, function () {
            response.json({success: false, message: Messages.initializeSystemFailed});
          });
        }, function () {
          response.json({success: false, message: Messages.initializeSystemFailed});
        });
      }, function () {
        response.json({success: false, message: Messages.initializeSystemFailed});
      });
    }, function () {
      response.json({success: false, message: Messages.initializeSystemFailed});
    });
  }, function () {
    response.json({success: false, message: Messages.initializeSystemFailed});
  });
};

module.exports = Preference;