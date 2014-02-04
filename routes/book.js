'use strict';

var Models = require('../models');
var Messages = require('../messages');
var Middlewares = require('../middlewares');
var _ = require('lodash');

var Book = {};

var summerizeBook = function (book) {
  return {
    schoolName: book.schoolName,
    preference: book.preference,
    date: book.date
  };
};

Book.registerRoute = function (app) {
  app.get('/book', Middlewares.Auth.requireAdmin, Book.getList);
  app.get('/book/summary', Middlewares.Auth.requireLogged, Book.getSummaryList);
  app.get('/book/:id', Middlewares.Auth.requireAdmin, Book.get);
  app.get('/book/:id/summary', Middlewares.Auth.requireLogged, Book.getSummary);
  app.post('/book', Middlewares.Auth.requireLogged, Book.post);
  app.delete('/book/:id', Middlewares.Auth.requireLogged, Book.delete);
};

Book.get = function (request, response) {
  var id = request.params.id;
  var query = Models.Book.findById(id);

  query.exec().then(function (book) {
    var subQuery = book.populate('register');
    subQuery.exec().then(function (populatedBook) {
      response.json({success: true, instance: populatedBook});
    }, function () {
      response.json({success: false, message: Messages.errorOnDatabase});
    });
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

Book.getSummary = function (request, response) {
  var id = request.params.id;
  var query = Models.Book.findById(id);

  query.exec().then(function (book) {
    response.json({success: true, instance: summerizeBook(book)});
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

Book.getList = function (request, response) {
  var startDate = request.query.startDate;
  var endDate = request.query.endDate;

  var query = Models.Book.find().gtEq({date: startDate}).ltEq({date: endDate});

  query.exec().then(function (books) {
    var subQuery = Models.Book.populate(books, 'register');
    subQuery.exec().then(function (populatedBooks) {
      response.json({success: true, books: populatedBooks});
    }, function () {
      response.json({success: false, message: Messages.errorOnDatabase});
    });
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

Book.getSummaryList = function (request, response) {
  var startDate = request.query.startDate;
  var endDate = request.query.endDate;

  var query = Models.Book.find().gtEq({date: startDate}).ltEq({date: endDate});

  query.exec().then(function (books) {
    response.json({success: true, books: _.map(books, summerizeBook)});
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

Book.post = function (request, response) {
  var user = request.session.user;
  var preference = request.body.preference;
  var date = request.body.date;
  var deprecated = false;

  // check if date is holiday
  var query = Models.Holiday.count({date: date});
  query.exec().then(function (count) {
    if (count == 0) {
      // check count of undeprecated books < 3
      var subQuery = Models.Book.count({deprecated: false, register: user._id});

      subQuery.exec().then(function (count) {
        if (count >= 3) { // count exceed
          response.json({success: false, message: Messages.exceedMaxBookCount});
        } else {
          // create new book
          var book = new Models.Book({
            register: user._id,
            schoolName: user.schoolName,
            preference: preference,
            date: date,
            deprecated: deprecated
          });

          book.save(function (error, instance) {
            if (error) {
              response.json({success: false, message: Messages.errorOnDatabase});
            } else {
              response.json({success: true, message: Messages.bookSuccess, instance: instance});
            }
          });
        }
      }, function () {
        response.json({success: false, message: Messages.errorOnDatabase});
      });
    } else { // selected date is holiday
      response.json({success: false, message: Messages.cannotBookOnHoliday});
    }
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });

};

Book.delete = function (request, response) {
  var user = request.session.user;
  var id = request.params.id;

  var query = Models.Book.findOneAndRemove({_id: id, register: user._id});

  query.exec().then(function () {
    response.json({success: true, message: Messages.bookDelete});
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

module.exports = Book;