var CONST = require('../conf/constant')
  , users = require('./dbManager').users;

var authManager = module.exports = {
    addNewAcount: function(userInfo, authOrigin, callback) {
      var user = {};
      if (authOrigin === 'facebook') {
        user = {
            nickname: userInfo.name
          , defaultAcount: authOrigin
          , facebook: userInfo
          , regDate: new Date()
        };
      }
      users.insert(user, callback);
//      if (data.loggedIn) {
//        if (data.twitter) {
//          var info = data.twitter;
//          user = {
//            nickname:nickname
//            , defaultAcount: 'twitter'
//            , twitter: {
//              id: info.user.id
//              , accessToken: info.accessToken
//              , accessTokenSecret: info.accessTokenSecret
//              , screenName: info.user.screen_name
//              , name: info.user.name
//              , profileImage: info.user.profile_image_url_https
//              , link: 'http://twitter.com/' + info.user.screen_name
//              , regdate: new Date()
//            }
//          };
//        }
//        this.users.insert(user);
//        callback(null, true);
//      } else {
//        callback(null, false);
//      }
    }
  , findAcountById: function(id, authOrigin, callback) {
      var criteria = {};
      criteria[authOrigin + '.id'] = id;
      users.findOne(criteria, function(err, user) {
        callback(err, user);
      });
    }
};
