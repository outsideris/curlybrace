"use strict";

var ObjectID = require('mongodb').ObjectID
  , authProvider = require('../../conf/config').authProvider;

module.exports = (function() {
  var users = null;
  var isObjectIDType = function(id) {
    return id._bsontype === 'ObjectID';
  };

  var getNickName = function(profile, provider) {
    return profile[authProvider[provider].nickNameField];
  };

  var isInited = function(callback) {
    if (users) {
      return true;
    } else {
      callback(new Error('users collection should not be null.'));
      return false;
    }
  };

  var normalizeProfile = function(profile, provider) {
    var _normalize = function(id, nickname, url, profile_image, description, email) {
      return {
          "id": id
        , "nickname": nickname
        , "url": url
        , "profile_image": profile_image
        , "description": description
        , "email": email
      };
    };

    if (provider === authProvider.facebook.name) {
      profile = profile._json;
      return _normalize(profile.id, profile.name, profile.link, null, null, profile.email);
    } else if (provider === authProvider.twitter.name) {
      profile = profile._json;
      return _normalize(profile.id, profile.name,
        "http://twitter.com/" + profile.screen_name, profile.profile_image_url,
        profile.description, null);
    } else if (provider === authProvider.github.name) {
      profile = profile._json;
      return _normalize(profile.id, profile.name, profile.html_url,
        profile.avatar_url, null, profile.email);
    } else if (provider === authProvider.me2day.name) {
      return _normalize(profile.id, profile.nickname, profile.me2dayHome,
        profile.face, profile.description, profile.email);
    } else if (provider === authProvider.google.name) {
      return _normalize(profile.id, profile.name, profile.link,
        profile.picture, null, profile.email);
    } else {
      return profile;
    }
  };

  return {
    init: function(db) {
      users = db.users;
    },
    insert: function(profile, provider, callback) {
      if (!isInited(callback)) { return false; }

      var user = {
          nickname: getNickName(profile, provider)
        , defaultProvider: provider
        , authInfo: {}
        , regDate: new Date()
      };
      user.authInfo[provider] = normalizeProfile(profile, provider);


      users.insert(user, {safe:true}, callback);
    },
    findOneBy: function(id, provider, callback) {
      if (!isInited(callback)) { return false; }

      var criteria = {};
      criteria['authInfo.' + provider + '.id'] = id;
      users.findOne(criteria, callback);
    },
    findOneByObjectId: function(id, callback) {
      if (!isInited(callback)) { return false; }

      var criteria = {};
      if (isObjectIDType(id)) {
        criteria._id = id;
      } else {
        criteria._id = new ObjectID(id);
      }

      users.findOne(criteria, callback);
    }
  };
})();