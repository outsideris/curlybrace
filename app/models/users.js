module.exports = {
    coll: null,
    init: function(db) {
      this.coll = db.users;
    },
    isInited: function(callback) {
      if (this.coll) {
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

      this.coll.insert(user, callback);
    }
  , findAcountBy: function(id, authOrigin, callback) {
      if (!this.isInited(callback)) { return false; }

      var criteria = {};
      criteria['authInfo.' + authOrigin + '.id'] = id;
      this.coll.findOne(criteria, callback);
    }
};
