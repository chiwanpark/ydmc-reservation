'use strict';

var Models = require('../models');
var Messages = require('../messages');
var Middlewares = require('../middlewares');
var Moment = require('moment');
var _ = require('lodash');

var Calculate = {};

Calculate.registerRoute = function (app) {
  app.get('/calculate', Middlewares.Auth.requireAdmin, Calculate.get);
};

Calculate.get = function (request, response) {
  var rangeStart = new Date(request.query.rangeStart);
  var rangeEnd = new Date(request.query.rangeEnd);

  if (!_.isDate(rangeStart) || !_.isDate(rangeEnd) || _.isNaN(rangeStart.getTime()) || _.isNaN(rangeEnd.getTime())) {
    response.json({success: false, message: Messages.invalidDateRange});
    return;
  }

  var query = Models.Book.find()
    .where('date').gte(rangeStart).where('date').lte(rangeEnd)
    .sort({ registered: 'asc', preference: 'asc'});

  query.exec().then(function (books) {
    var reserved = {};
    var unassigned = [];
    var count = {};

    _.forEach(books, function (book) {
      var date = Moment(book.date).format('YYYY-MM-DD');

      if (!(book.register in reserved)) {
        if ((count[date] < 2 || count[date] === undefined)) {
          reserved[book.register] = {
            _id: book._id,
            id: +book._id.getTimestamp() + Math.random() * 999,
            title: '(' + book.preference + ') ' + book.schoolName,
            register: book.register,
            cid: book.preference,
            start: book.date,
            end: book.date,
            ad: true
          };
          count[date] = ++count[date] || 1;
        } else if (book.preference == 3) {
          unassigned.push(book.schoolName);
        }
      }
    });

    var results = _.chain(reserved)
      .values()
      .filter(function (book) {
        return !!book;
      })
      .sortBy('start')
      .value();

    response.json({success: true, results: results, unassigned: unassigned});
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

module.exports = Calculate;