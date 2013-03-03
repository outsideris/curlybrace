// # 서버 실행 파일
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";
/*global isDev:true */

/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  , env = require('./src/conf/config').env
  , logger = require('./src/conf/config').logger
  , passport = require('passport')
  , dbService = require('./src/models/dbService');

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
  app.set('views', __dirname + '/src/views');
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
    // 개발용 로그인 모킹
    var mockLogin = function(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      var user = { nickname: 'Outsider',
        defaultProvider: 'twitter',
        authInfo:
        { twitter:
        { id: 7932892,
          nickname: 'Outsider',
          url: 'http://twitter.com/Outsideris',
          profileImage: 'http://a0.twimg.com/profile_images/1646891342/image_normal.jpg',
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
    // 개발용 디버그 로깅
    app.use(function(req, res, next) {
      logger.debug('requestInfo: ', {'req.params': req.params, 'req.query': req.query, 'req.body': req.body});
      next();
    });
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
require('./src/models/authentication')(passport);

// routes
require('./src/conf/routes')(app, passport);

// Binding Server
var server = module.exports.httpd = app.listen(env.PORT);
logger.info("Express server listening", {port: server.address().port, mode: app.get('env')});

// error handling
process.on('uncaughtException', function(err) {
  logger.debug('Caught exception:', {stackTrack: err.stack || err.message});
});
