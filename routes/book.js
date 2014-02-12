'use strict';

var Models = require('../models');
var Messages = require('../messages');
var Middlewares = require('../middlewares');
var _ = require('lodash');

var Book = {};

Book.domain = 'http://ydmc.co.kr';

var summerizeBook = function (book) {
  return {
    _id: book._id,
    register: book.register,
    id: +book._id.getTimestamp() + Math.random() * 999,
    cid: book.preference,
    title: '(' + book.preference + ') ' + book.schoolName,
    start: book.date,
    end: book.date,
    ad: true
  };
};

var summerizeHoliday = function (holiday) {
  return {
    id: +holiday._id.getTimestamp() + Math.random() * 999,
    cid: 4,
    title: Messages.workingday,
    start: holiday.date,
    end: holiday.date,
    ad: true
  }
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
  var query = Models.Book.findById(id).lean();

  query.exec().then(function (book) {
    Book.getFile(response, book);
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

Book.getFile = function (response, book) {
  var query = Models.File.find({register: book.register}).sort({registered: 'desc'}).limit(1).lean();

  query.exec().then(function (file) {
    if (file.length > 0) {
      file = file[0];
      book.file = Book.domain + '/file/download/' + file._id;
    } else {
      book.file = '';
    }
    Book.getComment(response, book);
  }, function () {
    book.file = '';
    Book.getComment(response, book);
  });
};

Book.getComment = function (response, book) {
  var query = Models.Comment.find({register: book.register}).sort({registered: 'desc'}).limit(1).lean();

  query.exec().then(function (comment) {
    if (comment.length > 0) {
      comment = comment[0];
      book.comment = comment.comment;
    } else {
      book.comment = '';
    }
    Book.returnBook(response, book);
  }, function () {
    book.comment = '';
    Book.returnBook(response, book);
  });
};

Book.returnBook = function (response, book) {
  response.json({success: true, book: book});
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
  var startDate = new Date(request.query.startDate);
  var endDate = new Date(request.query.endDate);

  if (!_.isDate(startDate) || !_.isDate(endDate) || _.isNaN(startDate.getTime()) || _.isNaN(endDate.getTime())) {
    startDate = new Date();
    endDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    endDate.setMonth(endDate.getMonth() + 1);
  }

  var query = Models.Book.find().where('date').gte(startDate).where('date').lte(endDate);

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
  var startDate = new Date(request.query.startDate);
  var endDate = new Date(request.query.endDate);

  if (!_.isDate(startDate) || !_.isDate(endDate) || _.isNaN(startDate.getTime()) || _.isNaN(endDate.getTime())) {
    startDate = new Date();
    endDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    endDate.setMonth(endDate.getMonth() + 1);
  }

  var query = Models.Book.find().where('date').gte(startDate).where('date').lte(endDate);

  query.exec().then(function (books) {
      var summerizedBooks = _.map(books, summerizeBook);
      var subQuery = Models.WorkingDay.find().where('date').gte(startDate).where('date').lte(endDate);
      subQuery.exec().then(function (holidays) {
        var summerizedHolidays = _.map(holidays, summerizeHoliday);
        response.json({success: true, books: summerizedBooks.concat(summerizedHolidays)});
      }, function () {
        response.json({success: true, books: summerizedBooks});
      });
    }, function () {
      response.json({success: false, message: Messages.errorOnDatabase});
    }
  );
};

Book.post = function (request, response) {
  var user = request.session.user;
  var preference = request.body.preference;
  var date = request.body.date;
  var deprecated = false;

  if (!preference || !date) {
    response.json({success: false, message: Messages.inputValidationFailed});
    return;
  }

  // check if date is holiday
  var query = Models.WorkingDay.count({date: date});
  query.exec().then(function (count) {
    if (count == 1) {
      // check count of undeprecated books < 3
      var subQuery = Models.Book.count({deprecated: false, register: user._id});

      subQuery.exec().then(function (count) {
        if (count >= 3) { // count exceed
          response.json({success: false, message: Messages.exceedMaxBookCount});
        } else {
          // check duplicated preferences
          var subQuery2 = Models.Book.count({deprecated: false, register: user._id, preference: preference});

          subQuery2.exec().then(function (count) {
            if (count == 0) {
              // check fulfilled by two 1st preference books
              var subQuery3 = Models.Book.count({preference: 1, date: date});

              subQuery3.exec().then(function (count) {
                if (count < 2) {
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
                } else {
                  response.json({success: false, message: Messages.fulfilledDay});
                }
              }, function () {
                response.json({success: false, message: Messages.errorOnDatabase});
              });
            } else {
              response.json({success: false, message: Messages.duplicatedBookPrefernces});
            }
          }, function () {
            response.json({success: false, message: Messages.errorOnDatabase});
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