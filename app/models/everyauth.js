var everyauth = require('everyauth')
  , authToken = require('../../conf/config').authToken
  , users = require('./users')
  , Promise = everyauth.Promise
  , http = require('http')
  , util = require('util')
  , AuthOriginEnum = require('../../conf/config').AuthOriginEnum;

module.exports = {
    init: function(db ) {
      everyauth.debug = true;

      this.enableFacebook();
      this.enableTwitter();
      this.enableGoogle();

      return everyauth;
    }
  , enableFacebook: function() {
      everyauth.facebook
      .appId(authToken.facebook.appId)
      .appSecret(authToken.facebook.appSecret)
      .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
        clog.debug('session: ' + util.inspect(session));
        clog.debug('accessToken: ' + util.inspect(accessToken));
        clog.debug('accessTokenExtra: ' + util.inspect(accessTokenExtra));
        clog.debug('fbUserMetadata: ' + util.inspect(fbUserMetadata));
        var promise = this.Promise();
        users.findAcountBy(fbUserMetadata.id, AuthOriginEnum.facebook, function(err, user) {
          if (err) return promise.fail(err);
          if (user) {
            promise.fulfill(user);
          } else {
            users.addNewAcount(fbUserMetadata, AuthOriginEnum.facebook, function(err, insertedUser) {
              promise.fulfill(insertedUser);
            });
          }
        });
        return promise;
      })
      .redirectPath('/');
    }
  , enableTwitter: function() {
      everyauth.twitter
      .consumerKey(authToken.twitter.consumerKey)
      .consumerSecret(authToken.twitter.consumerSecret)
      .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
        clog.debug('session: ' + util.inspect(session));
        clog.debug('accessToken: ' + util.inspect(accessToken));
        clog.debug('accessTokenSecret: ' + util.inspect(accessTokenSecret));
        clog.debug('twitterUserMetadata: ' + util.inspect(twitterUserMetadata));
        var promise = this.Promise();
        users.findAcountBy(twitterUserMetadata.id, AuthOriginEnum.twitter, function (err, user) {
          if (err) return promise.fail(err);
          if (user) {
            promise.fulfill(user);
          } else {
            users.addNewAcount(twitterUserMetadata, AuthOriginEnum.twitter, function(err, insertedUser) {
              promise.fulfill(insertedUser);
            });
          }
        });
        return promise;
      })
      .redirectPath('/');
    }
  , enableGoogle: function() {
      everyauth.google
      .appId(authToken.google.clientId)
      .appSecret(authToken.google.clientSecret)
      .scope('https://www.google.com/m8/feeds/')
      .findOrCreateUser( function (session, accessToken, accessTokenExtra, googleUserMetaData) {
        clog.debug('session: ' + util.inspect(session));
        clog.debug('accessToken: ' + util.inspect(accessToken));
        clog.debug('accessTokenExtra: ' + util.inspect(accessTokenExtra));
        clog.debug('googleUserMetaData: ' + util.inspect(googleUserMetaData));
        var promise = this.Promise();
        users.findAcountBy(googleUserMetaData.id, AuthOriginEnum.google, function (err, user) {
          if (err) return promise.fail(err);
          if (user) {
            promise.fulfill(user);
          } else {
            users.addNewAcount(googleUserMetaData, AuthOriginEnum.google, function(err, insertedUser) {
              promise.fulfill(insertedUser);
            });
          }
        });
        return promise;
      })
      .redirectPath('/');
    }
};
