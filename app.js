"use strict";
/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  , env = require('./conf/config').env
  , logger = require('./conf/config').logger
  , passport = require('passport')
  , dbService = require('./app/models/dbService');

dbService.init(function(err, db) {});

var app = module.exports = express();

// Configuration
app.configure(function() {
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('htuayreve'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(require('stylus').middleware(__dirname + '/public'));
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
var server = app.listen(env.PORT);
logger.info("Express server listening", {port: server.address().port, mode: app.get('env')});

// error handling
process.on('uncaughtException', function(err) {
  //logger.debug('Caught exception:', {stackTrack: err.stack || err.message})
});
