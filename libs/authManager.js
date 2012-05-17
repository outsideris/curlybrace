var CONST = require('../conf/constant')
  , AuthOriginEnum = require('../conf/enums').AuthOriginEnum;

var authManager = module.exports = {
    users: null,
    init: function(db) {
      this.users = db.users;
    },
    isInited: function(callback) {
      if (this.users) {
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

      this.users.insert(user, callback);
    }
  , findAcountBy: function(id, authOrigin, callback) {
      if (!this.isInited(callback)) { return false; }

      var criteria = {};
      criteria['authInfo.' + authOrigin + '.id'] = id;
      this.users.findOne(criteria, callback);
    }
};
