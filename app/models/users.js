module.exports = (function() {
  var users = null;
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

      users.insert(user, callback);
    },
    findAcountBy: function(id, authOrigin, callback) {
      if (!this.isInited(callback)) { return false; }

      var criteria = {};
      criteria['authInfo.' + authOrigin + '.id'] = id;
      users.findOne(criteria, callback);
    }
  };
})();