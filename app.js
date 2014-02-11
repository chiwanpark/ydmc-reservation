var express = require('express');
var _ = require('lodash');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var nconf = require('nconf');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('secret key', process.env.SECRET_KEY || 'secretkey');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.session({ secret: app.get('secret key') }));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

_.forIn(routes, function (value) {
  value.registerRoute(app);
});

nconf.file({file: 'preferences.json'});

if (!nconf.get('configured')) {
  nconf.set('configured', true);
  nconf.set('available', true);
  nconf.set('notice', '공지사항이 없습니다.');
  nconf.save(function (err) {
  });
}

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
