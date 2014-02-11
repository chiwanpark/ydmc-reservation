'use strict';

var Middlewares = require('../middlewares');
var Models = require('../models');
var Messages = require('../messages');
var _ = require('lodash');

var WorkingDay = {};

WorkingDay.registerRoute = function (app) {
  app.get('/workingday', Middlewares.Auth.requireLogged, WorkingDay.getList);
  app.post('/workingday/:date', Middlewares.Auth.requireAdmin, WorkingDay.post);
  app.delete('/workingday/:date', Middlewares.Auth.requireAdmin, WorkingDay.delete);
};

WorkingDay.getList = function (request, response) {
  var startDate = new Date(request.query.startDate);
  var endDate = new Date(request.query.endDate);

  if (!_.isDate(startDate) || !_.isDate(endDate) || _.isNaN(startDate.getTime()) || _.isNaN(endDate.getTime())) {
    startDate = new Date();
    endDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    endDate.setMonth(endDate.getMonth() + 1);
  }

  var query = Models.WorkingDay.find().where('date').gte(startDate).where('date').lte(endDate);

  query.exec().then(function (workingDays) {
    var formattedWorkingDays = _.map(workingDays, function (value) {
      return {
        id: +value._id.getTimestamp() + Math.random() * 999,
        cid: 1,
        title: Messages.workingday,
        start: value.date,
        end: value.date,
        ad: true
      }
    });
    response.json({success: true, workingdays: formattedWorkingDays});
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

WorkingDay.post = function (request, response) {
  var date = request.params.date;
  var query = Models.WorkingDay.count({date: date});

  query.exec().then(function (count) {
    if (count == 0) {
      var workingDay = new Models.WorkingDay({date: date});

      workingDay.save(function (error) {
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

WorkingDay.delete = function (request, response) {
  var date = request.params.date;
  var query = Models.WorkingDay.findOneAndRemove({date: date});

  query.exec().then(function () {
    response.json({success: true});
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

module.exports = WorkingDay;