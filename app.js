"use strict";
/*global isDev:true */

/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  , env = require('./conf/config').env
  , logger = require('./conf/config').logger
  , passport = require('passport')
  , dbService = require('./app/models/dbService');

// 디비 초기화
dbService.init();

var app = module.exports = express();

// set env Mode
var isDev = false;
if (app.get('env') === 'development') {
  isDev = true;
}

// Configuration
app.configure(function() {
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('htuayreve'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  if (isDev) {
    var mockLogin = function(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      var user = { nickname: 'Outsider',
        defaultProvider: 'twitter',
        authInfo:
        { twitter:
        { id: 7932892,
          nickname: 'Outsider',
          url: 'http://twitter.com/Outsideris',
          profile_image: 'http://a0.twimg.com/profile_images/1646891342/image_normal.jpg',
          description: 'Programmer / Hacker',
          email: null } },
        regDate: '',
        _id: '5087f03698ec321f28000001'
      };
      req.login(user, function(err) {
        next(err);
      });
    };

    app.use(mockLogin);
  }
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// autentication
require('./app/models/authentication')(passport);

// routes
require('./conf/routes')(app, passport);

// Binding Server
var server = module.exports.httpd = app.listen(env.PORT);
logger.info("Express server listening", {port: server.address().port, mode: app.get('env')});

// error handling
process.on('uncaughtException', function(err) {
  logger.debug('Caught exception:', {stackTrack: err.stack || err.message});
});
