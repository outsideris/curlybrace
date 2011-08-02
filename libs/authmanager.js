var Mongolian = require('mongolian')
  , CONST = require('../conf/constant');

var authManager = module.exports = {
  server: null
, db: null
, users: null
, init: function() {
     this.server = new Mongolian('localhost:27017');
     this.db = this.server.db('curlybrace');
     this.users = this.db.collection('users');
//     console.log(this.users);
//     console.log('constant:' + CONST.MONGODB_HOST + '/' + CONST.MONGODB_POST + '/' + CONST.MONGODB_DB + '/' + CONST.MONGODB_COLLECTION);
     return this;
  }
, addNewAcount: function(data, nickname, callback) {
    var user;
    if (data.loggedIn) {
      if (data.twitter) {
        var info = data.twitter;
        user = {
          nickname:nickname
        , defaultAcount: 'twitter'
        , twitter: {
            origin: 'twitter'
          , id: info.user.id
          , accessToken: info.accessToken
          , accessTokenSecret: info.accessTokenSecret
          , screenName: info.user.screen_name
          , name: info.user.name
          , profileImage: info.user.profile_image_url_https
          , link: 'http://twitter.com/' + info.user.screen_name
          }
        };
      }
      this.users.insert(user); 
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
, findAcountByid: function(id, type, callback) {
   // console.log('findAcountByid' + id + '/' + type + '/' + callback);
    var key = type + '.id';
    this.users.findOne({'twitter.id':id}, function(err, user) {
      callback(null, user);
    });
  }
}.init();

authManager = module.exports; 
