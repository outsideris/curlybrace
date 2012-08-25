var ObjectID = require('mongodb').ObjectID
  , logger = require('../../conf/config').logger;

module.exports = (function() {
  var users = null;
  var isObjectIDType = function(id) {
    return id._bsontype === 'ObjectID';
  };

  var getNickName = function(profile, from) {

    // me2day nickname
    // google name
    // facebook displayName
    // github displayName
    // twitter displayName
  };

  return {
    init: function(db) {
      users = db.users;
    },
    isInited: function(callback) {
      if (users) {
        return true;
      } else {
        callback(new Error('users collection should not be null.'));
        return false;
      }
    },
    addNewAcount: function(userInfo, authOrigin, callback) {
      if (!this.isInited(callback)) { return false; }

      var user = {
          nickname: userInfo.name
        , defaultAcountType: authOrigin
        , authInfo: {}
        , regDate: new Date()
      };
      user['authInfo'][authOrigin] = userInfo;

      users.insert(user, {safe:true}, callback);
    },
    findAcountBy: function(id, authOrigin, callback) {
      if (!this.isInited(callback)) { return false; }

      var criteria = {};
      criteria['authInfo.' + authOrigin + '.id'] = id;
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