var ObjectID = require('mongodb').ObjectID
  , authProvider = require('../../conf/config').authProvider
  , logger = require('../../conf/config').logger;

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
      if (provider === authProvider.facebook.name || provider === authProvider.twitter.name) {
        user['authInfo'][provider] = profile._json;
      } else {
        user['authInfo'][provider] = profile;
      }

      users.insert(user, {safe:true}, callback);
    },
    findOneBy: function(id, provider, callback) {
      if (!this.isInited(callback)) { return false; }

      var criteria = {};
      criteria['authInfo.' + provider + '.id'] = id;
      users.findOne(criteria, callback);
    },
    findOneByObjectId: function(id, callback) {
      if (!this.isInited(callback)) { return false; }

      var criteria = {};
      if (isObjectIDType(id)) {
        criteria['_id'] = id;
      } else {
        criteria['_id'] = new ObjectID(id);
      }

      users.findOne(criteria, callback);
    }
  };
})();