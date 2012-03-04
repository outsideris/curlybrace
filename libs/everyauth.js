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
      clog.debug(user);
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
  .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
    var promise = this.Promise();
    authmanager.findAcountByid(twitUser.id, 'twitter', function (err, user) {
      if (err) return promise.fail(err);
      //user ? promise.fulfill(user) : promise.fulfill({});
      if (user) {
        clog.info('user');
        promise.fulfill(user);
      } else {
        clog.info('none');
        promise.fulfill({})
      }
    });
    return promise;
  })
  .redirectPath('/join');

everyauth
  .google
  .myHostname(CONST.HOST)
  .appId(conf.google.clientId)
  .appSecret(conf.google.clientSecret)
  .scope('https://www.google.com/m8/feeds/')
  .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
    console.log('google find');
    googleUser.refreshToken = extra.refresh_token;
    googleUser.expiresIn = extra.expires_in;
    return googleUser;
    //return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = googleUser);
  })
  .redirectPath('/join');

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
