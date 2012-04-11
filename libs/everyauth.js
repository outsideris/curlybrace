var everyauth = module.exports = require('everyauth')
  , conf = require('../conf/authconf')
  , CONST = require('../conf/constant')
  , authManager = require('./authManager')
  , Promise = everyauth.Promise
  , http = require('http')
  , AuthOriginEnum = require('../conf/enums').AuthOriginEnum;

var util = require('util');

everyauth.debug = true;

var usersByFbId = {};
var usersByTwitId = {};
var usersByGoogleId = {};
var usersByMe2dayId = {};

everyauth.facebook
  .appId(conf.facebook.appId)
  .appSecret(conf.facebook.appSecret)
  .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
    clog.debug('session: ' + util.inspect(session));
    clog.debug('accessToken: ' + util.inspect(accessToken));
    clog.debug('accessTokenExtra: ' + util.inspect(accessTokenExtra));
    clog.debug('fbUserMetadata: ' + util.inspect(fbUserMetadata));
    var promise = this.Promise();
    authManager.findAcountBy(fbUserMetadata.id, AuthOriginEnum.facebook, function(err, user) {
      if (err) return promise.fail(err);
      if (user) {
        promise.fulfill(user);
      } else {
        authManager.addNewAcount(fbUserMetadata, AuthOriginEnum.facebook, function(err, insertedUser) {
          promise.fulfill(insertedUser);
        });
      }
    });
    return promise;
  })
  .redirectPath('/');

everyauth.twitter
  .consumerKey(conf.twitter.consumerKey)
  .consumerSecret(conf.twitter.consumerSecret)
  .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
    clog.debug('session: ' + util.inspect(session));
    clog.debug('accessToken: ' + util.inspect(accessToken));
    clog.debug('accessTokenSecret: ' + util.inspect(accessTokenSecret));
    clog.debug('twitterUserMetadata: ' + util.inspect(twitterUserMetadata));
    var promise = this.Promise();
    authManager.findAcountBy(twitterUserMetadata.id, AuthOriginEnum.twitter, function (err, user) {
      if (err) return promise.fail(err);
      if (user) {
        promise.fulfill(user);
      } else {
        authManager.addNewAcount(twitterUserMetadata, AuthOriginEnum.twitter, function(err, insertedUser) {
          promise.fulfill(insertedUser);
        });
      }
    });
    return promise;
  })
  .redirectPath('/');

everyauth.google
  .appId(conf.google.clientId)
  .appSecret(conf.google.clientSecret)
  .scope('https://www.google.com/m8/feeds/')
  .findOrCreateUser( function (session, accessToken, accessTokenExtra, googleUserMetaData) {
    clog.debug('session: ' + util.inspect(session));
    clog.debug('accessToken: ' + util.inspect(accessToken));
    clog.debug('accessTokenExtra: ' + util.inspect(accessTokenExtra));
    clog.debug('googleUserMetaData: ' + util.inspect(googleUserMetaData));
    var promise = this.Promise();
    authManager.findAcountBy(googleUserMetaData.id, AuthOriginEnum.google, function (err, user) {
      if (err) return promise.fail(err);
      if (user) {
        promise.fulfill(user);
      } else {
        authManager.addNewAcount(googleUserMetaData, AuthOriginEnum.google, function(err, insertedUser) {
          promise.fulfill(insertedUser);
        });
      }
    });
    return promise;
  })
  .redirectPath('/');

everyauth.me2day = function(callback) {
  var options = {
    host: 'me2day.net'
    , port: 80
    , path: '/api/get_auth_url.json?akey=' + conf.me2day.key
  };
  http.get(options, function(res) {
    var body = '';
    res.on('data', function(data) {
      body += data;
    });
    res.on('end', function() {
      body = JSON.parse(body);
      callback(null, body.url, body.token);
    });
  }).on('error', function(e) {
      callback(e);
    });
};
