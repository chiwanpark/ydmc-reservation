'use strict';

var Page = {};

Page.registerRoute = function (app) {
  app.get('/', Page.index);
};

Page.index = function (request, response) {
  response.render('index');
};

module.exports = Page;