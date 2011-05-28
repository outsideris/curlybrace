var everyauth = module.exports = require('everyauth')
  , conf = require('../conf/authconf');

everyauth.debug = true;

var usersByFbId = {};
var usersByTwitId = {};
var usersByGoogleId = {};
var usersByMe2dayId = {};

everyauth
  .facebook
    .myHostname('http://curlybrace:3000')
    .appId(conf.facebook.appId)
    .appSecret(conf.facebook.appSecret)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
      return usersByFbId[fbUserMetadata.id] ||
        (usersByFbId[fbUserMetadata.id] = fbUserMetadata);
    })
    .redirectPath('/');

everyauth
  .twitter
    .myHostname('http://curlybrace:3000')
    .consumerKey(conf.twitter.consumerKey)
    .consumerSecret(conf.twitter.consumerSecret)
    .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
      return usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = twitUser);
    })
    .redirectPath('/');

everyauth.google
  .myHostname('http://curlybrace:3000')
  .appId(conf.google.clientId)
  .appSecret(conf.google.clientSecret)
  .scope('https://www.google.com/m8/feeds/')
  .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
    googleUser.refreshToken = extra.refresh_token;
    googleUser.expiresIn = extra.expires_in;
    return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = googleUser);
  })
  .redirectPath('/');
  
// everyauth.me2day
