var everyauth = module.exports = require('everyauth')
  , conf = require('../conf/authconf')
  , CONST = require('../conf/constant')
  , http = require('http');

everyauth.debug = true;

var usersByFbId = {};
var usersByTwitId = {};
var usersByGoogleId = {};
var usersByMe2dayId = {};

everyauth
  .facebook
    .myHostname(CONST.HOST)
    .appId(conf.facebook.appId)
    .appSecret(conf.facebook.appSecret)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
      return usersByFbId[fbUserMetadata.id] ||
        (usersByFbId[fbUserMetadata.id] = fbUserMetadata);
    })
    .redirectPath('/join');

everyauth
  .twitter
    .myHostname(CONST.HOST)
    .consumerKey(conf.twitter.consumerKey)
    .consumerSecret(conf.twitter.consumerSecret)
    .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
      var promise = this.Promise();
      return twitUser;
      //return promise;
      // return usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = twitUser);
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
