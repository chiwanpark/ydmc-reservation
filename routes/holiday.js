'use strict';

var Middlewares = require('../middlewares');
var Models = require('../models');
var Messages = require('../messages');

var Holiday = {};

Holiday.registerRoute = function (app) {
  app.get('/holiday', Middlewares.Auth.requireAdmin, Holiday.getList);
  app.post('/holiday/:date', Middlewares.Auth.requireAdmin, Holiday.post);
  app.delete('/holiday/:date', Middlewares.Auth.requireAdmin, Holiday.delete);
};

Holiday.getList = function (request, response) {
  var query = Models.Holiday.find();

  query.exec().then(function (holidays) {
    response.json({success: true, holidays: holidays});
  }, function () {
    response.json({success: true, message: Messages.errorOnDatabase});
  });
};

Holiday.post = function (request, response) {
  var date = request.params.date;
  var query = Models.Holiday.count({date: date});

  query.exec().then(function (count) {
    if (count == 0) {
      var holiday = new Models.Holiday({date: date});

      holiday.save(function (error) {
        if (error) {
          response.json({success: false, message: Messages.errorOnDatabase});
        } else {
          response.json({success: true});
        }
      });
    } else {
      response.json({success: true});
    }
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

Holiday.delete = function (request, response) {
  var date = request.params.date;
  var query = Models.Holiday.findOneAndRemove({date: date});

  query.exec().then(function () {
    response.json({success: true});
  }, function () {
    response.json({success: true, message: Messages.errorOnDatabase});
  });
};

module.exports = Holiday;