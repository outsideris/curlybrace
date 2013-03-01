// # 사용자관련 모델
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";
// Module dependencies.
var ObjectID = require('mongodb').ObjectID
  , authProvider = require('../../src/conf/config').authProvider
  , logger = require('../../src/conf/config').logger;

module.exports = (function() {
  var users = null;
  // MongoDB의 ObjectID 타입여부 검사
  var isObjectIDType = function(id) {
    logger.debug('users.isObjectIDType', {id: id});
    return id._bsontype === 'ObjectID';
  };
  // 사용자 정보에서 닉네임 조회.
  // SNS 별로 닉네임 필드가 다르기 때문에 별도의 함수를 사용한다.
  // (닉네임필드는 `config.js`에서 지정)
  var getNickName = function(profile, provider) {
    logger.debug('users.getNickName', {profile: profile});
    return profile[authProvider[provider].nickNameField];
  };
  // 컬렉션 할당 여부
  var isInited = function(callback) {
    logger.debug('users.isInited');
    if (users) {
      return true;
    } else {
      callback(new Error('users collection should not be null.'));
      return false;
    }
  };
  // SNS 마다 다른 형태의 프로필 객체를 같은 형식으로 정규화한다.
  var normalizeProfile = function(profile, provider) {
    logger.debug('users.normalizeProfile', {profile: profile});
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
    // 컬렉션 할당
    init: function(db) {
      logger.debug('users.init');
      users = db.users;
    },
    // 사용자 정보를 디비에 추가한다.
    insert: function(profile, provider, callback) {
      logger.debug('users.insert', {profile: profile, provider:provider});
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
    // 사용자 ID와 SNS 종류로 사용자를 조회한다.
    findOneBy: function(id, provider, callback) {
      logger.debug('users.findOneBy', {id: id, provider:provider});
      if (!isInited(callback)) { return false; }

      var criteria = {};
      criteria['authInfo.' + provider + '.id'] = id;
      users.findOne(criteria, callback);
    },
    // ObjectID로 사용자를 조회한다.
    findOneByObjectId: function(id, callback) {
      logger.debug('users.findOneByObjectId', {id: id});
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
