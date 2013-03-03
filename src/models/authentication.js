// # 인증관련 모델
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";

// Module dependencies.
var authToken = require('../../src/conf/config').authToken
  , authProvider = require('../../src/conf/config').authProvider
  , env = require('../../src/conf/config').env
  , logger = require('../../src/conf/config').logger
  , users = require('./users')
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , GitHubStrategy = require('passport-github').Strategy
  , Me2dayStrategy = require('passport-me2day').Strategy;

module.exports = function(passport) {
  // 세션 저장을 위한 로그인한 사용자 정보 직렬화
  passport.serializeUser(function(user, done) {
    logger.debug('authentication:passport.serializeUser', {user: user});
    var id = user._id || user[0]._id;
    done(null, id);
  });
  // 세션 저장을 위한 로그인한 사용자 정보 역직렬화
  passport.deserializeUser(function(id, done) {
    logger.debug('authentication:passport.deserializeUser', {id: id});
    users.findOneByObjectId(id, function (err, user) {
      done(err, user);
    });
  });

  // passport 트위터 전략
  passport.use(new TwitterStrategy({
      consumerKey: authToken.twitter.consumerKey,
      consumerSecret: authToken.twitter.consumerSecret,
      callbackURL: env.HOST + "/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      logger.debug('authentication:passport.twitter', {token: token, token_secret: tokenSecret, profile: profile});
      users.findOneBy(profile.id, authProvider.twitter.name, function (err, user) {
        if (err)  { return done(err, null); }
        if (user) {
          return done(err, user);
        } else {
          users.insert(profile, authProvider.twitter.name, function(err, insertedUser) {
            return done(err, insertedUser);
          });
        }
      });
    }
  ));

  // passport 페이스북 전략
  passport.use(new FacebookStrategy({
      clientID: authToken.facebook.appId,
      clientSecret: authToken.facebook.appSecret,
      callbackURL: env.HOST + "/auth/facebook/callback",
      profileFields: [
        'id',
        'username',
        'displayName',
        'name',
        'gender',
        'profileUrl',
        'emails',
        'photos'
      ]
    },
    function(accessToken, refreshToken, profile, done) {
      logger.debug('authentication:passport.facebook', {accessToken: accessToken, refreshToken: refreshToken, profile: profile});
      users.findOneBy(profile.id, authProvider.facebook.name, function(err, user) {
        if (err)  { return done(err, null); }
        if (user) {
          return done(err, user);
        } else {
          users.insert(profile, authProvider.facebook.name, function(err, insertedUser) {
            return done(err, insertedUser[0]);
          });
        }
      });
    }
  ));

  // passport 구글 전략
  passport.use(new GoogleStrategy({
      clientID: authToken.google.clientId,
      clientSecret: authToken.google.clientSecret,
      /* callbackURL: env.HOST + "/auth/google/callback" */
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      profile = JSON.parse(profile._raw);
      logger.debug('authentication:passport.google', {accessToken: accessToken, refreshToken: refreshToken, profile: profile});
      users.findOneBy(profile.id, authProvider.google.name, function(err, user) {
        if (err) { return done(err, null); }
        if (user) {
          return done(err, user);
        } else {
          users.insert(profile, authProvider.google.name, function(err, insertedUser) {
            return done(err, insertedUser[0]);
          });
        }
      });
    }
  ));

  // passport Github 전략
  passport.use(new GitHubStrategy({
      clientID: authToken.github.clientId,
      clientSecret: authToken.github.clientSecret,
      callbackURL: env.HOST + "/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      logger.debug('authentication:passport.github', {accessToken: accessToken, refreshToken: refreshToken, profile: profile});
      users.findOneBy(profile.id, authProvider.github.name, function(err, user) {
        if (err) { return done(err, null); }
        if (user) {
          return done(err, user);
        } else {
          users.insert(profile, authProvider.github.name, function(err, insertedUser) {
            return done(err, insertedUser[0]);
          });
        }
      });
    }
  ));

  // passport 미투데이 전략
  passport.use(new Me2dayStrategy({
      userKey: authToken.me2day.key
      , nonce: authToken.me2day.nonce
      , callbackURL: env.HOST + "/auth/me2day/callback"
    },
    function(userKey, profile, done) {
      logger.debug('authentication:passport.me2day', {userKey: userKey, profile: profile});
      users.findOneBy(profile.id, authProvider.me2day.name, function(err, user) {
        if (err)  { return done(err, null); }
        if (user) {
          return done(err, user);
        } else {
          users.insert(profile, authProvider.me2day.name, function(err, insertedUser) {
            return done(err, insertedUser[0]);
          });
        }
      });
    }
  ));
};
