var authToken = require('../../conf/config').authToken
  , AuthOriginEnum = require('../../conf/config').AuthOriginEnum
  , env = require('../../conf/config').env
  , users = require('./users')
  , http = require('http')
  , util = require('util')
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , GitHubStrategy = require('passport-github').Strategy
  , Me2dayStrategy = require('passport-me2day').Strategy
  , logger = require('../../conf/config').logger;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    console.log(user);
    var id = user._id || user[0]._id;
    done(null, id);
  });

  passport.deserializeUser(function(id, done) {
    users.findOneByObjectId(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new TwitterStrategy({
      consumerKey: authToken.twitter.consumerKey,
      consumerSecret: authToken.twitter.consumerSecret,
      callbackURL: env.HOST + "/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done) {
      users.findAcountBy(profile.id, AuthOriginEnum.twitter, function (err, user) {
        if (err) return done(err, null);
        if (user) {
          return done(err, user);
        } else {
          users.addNewAcount(profile, AuthOriginEnum.twitter, function(err, insertedUser) {
            return done(err, insertedUser);
          });
        }
      });
    }
  ));

  passport.use(new FacebookStrategy({
      clientID: authToken.facebook.appId,
      clientSecret: authToken.facebook.appSecret,
      callbackURL: env.HOST + "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      users.findAcountBy(profile.id, AuthOriginEnum.facebook, function(err, user) {
        if (err) return done(err, null);
        if (user) {
          return done(err, user);
        } else {
          users.addNewAcount(profile, AuthOriginEnum.facebook, function(err, insertedUser) {
            return done(err, insertedUser[0]);
          });
        }
      });
    }
  ));

  passport.use(new GoogleStrategy({
      clientID: authToken.google.clientId,
      clientSecret: authToken.google.clientSecret,
//      callbackURL: env.HOST + "/auth/google/callback"
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      profile = JSON.parse(profile._raw);
      users.findAcountBy(profile.id, AuthOriginEnum.google, function(err, user) {
        if (err) return done(err, null);
        if (user) {
          return done(err, user);
        } else {
          users.addNewAcount(profile, AuthOriginEnum.google, function(err, insertedUser) {
            return done(err, insertedUser[0]);
          });
        }
      });
    }
  ));

  passport.use(new GitHubStrategy({
      clientID: authToken.github.clientId,
      clientSecret: authToken.github.clientSecret,
      callbackURL: env.HOST + "/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      users.findAcountBy(profile.id, AuthOriginEnum.github, function(err, user) {
        if (err) return done(err, null);
        if (user) {
          return done(err, user);
        } else {
          users.addNewAcount(profile, AuthOriginEnum.github, function(err, insertedUser) {
            return done(err, insertedUser[0]);
          });
        }
      });
    }
  ));

  passport.use(new Me2dayStrategy({
      userKey: authToken.me2day.key
      , nonce: authToken.me2day.nonce
      , callbackURL: env.HOST + "/auth/me2day/callback"
    },
    function(userKey, profile, done) {
      users.findAcountBy(profile.id, AuthOriginEnum.me2day, function(err, user) {
        if (err) return done(err, null);
        if (user) {
          return done(err, user);
        } else {
          users.addNewAcount(profile, AuthOriginEnum.me2day, function(err, insertedUser) {
            return done(err, insertedUser[0]);
          });
        }
      });
    }
  ));
};
