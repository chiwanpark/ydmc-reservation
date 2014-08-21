'use strict';

var Models = require('../models');
var Messages = require('../messages');
var Middlewares = require('../middlewares');
var nconf = require('nconf');

nconf.file({file: 'preferences.json', dir: '../'});

var User = {};

User.registerRoute = function (app) {
  app.get('/user', Middlewares.Auth.requireAdmin, User.getList);
  app.post('/user', User.post);
  app.post('/user/login', User.login);
  app.get('/user/logout', User.logout);
  app.get('/user/:id', User.getById);
  app.delete('/user/:id', User.deleteById);
  app.put('/user/:id', Middlewares.Auth.requireLogged, User.put);
};

User.getList = function (request, response) {
  var query = Models.User.find().lean();

  query.exec().then(function (users) {
    response.json({success: true, users: users});
  }, function () {
    response.json({success: false});
  });
};

User.getById = function (request, response) {
  var id = request.params.id;
  var query = Models.User.findById(id).lean();

  query.exec().then(function (user) { // success
    if (user) {
      response.json({success: true, user: user});
    } else {
      response.json({success: false, message: Messages.errorOnDatabase});
    }
  }, function () { // failed
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

User.post = function (request, response) {
  var email = request.body.email || null;
  var teacherName = request.body.teacherName || null;
  var password = request.body.password || null;
  var schoolName = request.body.schoolName || null;
  var phone = request.body.phone || null;
  var admin = false;
  var verified = false;

  // validate parameters
  if (!email || !teacherName || !password || !schoolName) {
    response.json({success: false, message: Messages.inputValidationFailed});
    return;
  }

  // check unique email
  var query = Models.User.count({email: email});

  query.exec().then(function (count) {
    if (count == 0) { // if email is unique
      // save new user
      var user = new Models.User({
        teacherName: teacherName,
        password: password,
        phone: phone,
        email: email,
        schoolName: schoolName,
        admin: admin,
        verified: verified
      });

      user.save(function (error, instance) {
        if (error) { // error occurred
          response.json({success: false})
        } else { // complete saving user
          response.json({success: true, message: Messages.postUserSuccess, instance: instance});
        }
      });
    } else { // if teacher name is duplicated
      response.json({success: false, message: Messages.duplicatedEmail});
    }
  }, function () { // check unique email failed.
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

User.put = function (request, response) {
  var id = request.params.id || null;
  var email = request.body.email || null;
  var teacherName = request.body.teacherName || null;
  var password = request.body.password || null;
  var schoolName = request.body.schoolName || null;
  var admin = request.body.admin === "true";
  var verified = request.body.verified === "true";
  var phone = request.body.phone || null;

  // validate parameters
  if (!id || !email || !teacherName || !schoolName) {
    response.json({success: false, message: Messages.inputValidationFailed});
    return;
  }

  // update user information
  var query = Models.User.findById(id);

  // because of mongoose setter is not applied when using findOneAndUpdate method,
  // we first just findOne, next modify and finally save.
  query.exec().then(function (user) {
    user.teacherName = teacherName;
    if (password) {
      user.password = password;
    }
    user.email = email;
    user.schoolName = schoolName;
    user.admin = admin;
    user.verified = verified;
    user.phone = phone;

    user.save(function (error, instance) {
      if (error) { // error occurred
        response.json({success: false, message: Messages.errorOnDatabase})
      } else { // complete saving user
        response.json({success: true, instance: instance, message: Messages.userUpdateSuccess});
      }
    });
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

User.login = function (request, response) {
  var email = request.body.email || null;
  var password = request.body.password || null;

  // validate parameters
  if (!email || !password) {
    response.json({success: false, message: Messages.inputValidationFailed});
    return;
  }

  var query = Models.User.findOne({email: email});

  query.exec().then(function (user) {
    if (user && user.verifyPassword(password)) {
      if (!user.admin && !nconf.get('available')) {
        response.json({success: false, message: Messages.notAvailableTime});
        return;
      }

      if (!user.verified) {
        response.json({success: false, message: Messages.userNotVerified});
        return;
      }

      request.session.regenerate(function () {
        request.session.user = user;
        response.json({success: true, message: Messages.loginSuccess, instance: user});
      });
    } else {
      response.json({success: false, message: Messages.loginFailed});
    }
  }, function () {
    response.json({success: false, message: Messages.loginFailed});
  });
};

User.logout = function (request, response) {
  request.session.destroy(function () {
    response.json({success: true, message: Messages.logoutSuccess});
  });
};

User.deleteById = function (request, response) {
  var id = request.params.id || null;
  var query = Models.Book.remove({register: id});

  query.exec().then(function () {
    Models.User.findByIdAndRemove(id).exec().then(function () {
      response.json({success: true, message: Messages.userDeleted});
    }, function () {
      response.json({success: false, message: Messages.userDeleteFailed});
    });
  }, function () {
    response.json({success: false, message: Messages.userDeleteFailed});
  });
};

module.exports = User;
