'use strict';

var Models = require('../models');
var Messages = require('../messages');
var Middlewares = require('../middlewares');

var Comment = {};

Comment.registerRoute = function (app) {
  app.get('/comment/last', Middlewares.Auth.requireLogged, Comment.getLast);
  app.get('/comment/get/:id', Middlewares.Auth.requireLogged, Comment.get);
  app.post('/comment', Middlewares.Auth.requireLogged, Comment.post);
};

Comment.getLast = function (request, response) {
  var user = request.session.user;
  var query = Models.Comment.find({register: user._id}).sort({registered: 'desc'}).limit(1);

  query.exec().then(function (comment) {
    response.json({success: true, comment: comment[0]});
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

Comment.get = function (request, response) {
  var id = request.params.id;
  var user = request.session.user;
  var query = Models.Comment.findById(id);

  query.exec().then(function (comment) {
    if (comment.register === user._id || user.admin) {
      response.json({success: true, comment: comment});
    } else {
      response.json({success: false, message: Messages.unauthorized});
    }
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  })
};

Comment.post = function (request, response) {
  var user = request.session.user;
  var commentValue = request.body.comment;

  if (!commentValue) {
    response.json({success: false, message: Messages.inputValidationFailed});
    return;
  }

  var comment = new Models.Comment({
    register: user._id,
    comment: commentValue
  });

  comment.save(function (error) {
    if (error) {
      response.json({success: false, message: Messages.fileUploadError});
    } else {
      response.json({success: true, comment: comment});
    }
  });
};

module.exports = Comment;