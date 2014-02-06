'use strict';

var Fs = require('fs');
var Path = require('path');
var Models = require('../models');
var Messages = require('../messages');
var Middlewares = require('../middlewares');

var File = {};

File.saveDir = Path.join(__dirname, '../files/');

File.registerRoute = function (app) {
  app.get('/file/last', Middlewares.Auth.requireLogged, File.getLast);
  app.get('/file/download/:id', Middlewares.Auth.requireLogged, File.get);
  app.post('/file', Middlewares.Auth.requireLogged, File.post);
};

File.getLast = function (request, response) {
  var user = request.session.user;
  var query = Models.File.find({register: user._id}).sort({registered: 'desc'}).limit(1);

  query.exec().then(function (file) {
    response.json({success: true, file: file[0]});
  }, function() {
    response.json({success: false, message: Messages.errorOnDatabase});
  });
};

File.get = function (request, response) {
  var id = request.params.id;
  var user = request.session.user;
  var query = Models.File.findById(id);

  query.exec().then(function (file) {
    if (file.register === user._id || user.admin) {
      response.setHeader('Content-disposition', 'attachment; filename=' + file.originalFilename);
      response.setHeader('Content-Type', 'application/octet-stream');
      Fs.createReadStream(file.filePath).pipe(response);
    } else {
      response.json({success: false, message: Messages.unauthorized});
    }
  }, function () {
    response.json({success: false, message: Messages.errorOnDatabase});
  })
};

File.post = function (request, response) {
  var user = request.session.user;
  var attachment = request.files.attachment;

  if (!attachment) {
    response.json({success: false, message: Messages.inputValidationFailed});
    return;
  }

  var outputName = user._id.toString() + (new Date().getTime()) + '_' + Math.floor(Math.random() * 1000);
  var outputPath = Path.join(File.saveDir, outputName);

  Fs.rename(attachment.path, outputPath, function (error) {
    if (error) {
      response.json({success: false, message: Messages.fileUploadError});
    } else {
      var file = new Models.File({
        register: user._id,
        filePath: outputPath,
        originName: attachment.name
      });

      file.save(function(error) {
        if (error) {
          response.json({success: false, message: Messages.fileUploadError});
        } else {
          response.json({success: true, fileInfo: file});
        }
      });
    }
  });
};

module.exports = File;