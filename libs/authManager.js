var CONST = require('../conf/constant')
  , AuthOriginEnum = require('../conf/enums').AuthOriginEnum
  , db = require('./dbManager');

var authManager = module.exports = {
    addNewAcount: function(userInfo, authOrigin, callback) {
      var user = {
          nickname: userInfo.name
        , defaultAcountType: authOrigin
        , authInfo: {}
        , regDate: new Date()
      };
      user['authInfo'][authOrigin] = userInfo;

      db.users.insert(user, callback);
    }
  , findAcountBy: function(id, authOrigin, callback) {
      var criteria = {};
      criteria['authInfo.' + authOrigin + '.id'] = id;
      db.users.findOne(criteria, callback);
    }
};
