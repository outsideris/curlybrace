var CONST = require('../conf/constant')
  , AuthOriginEnum = require('../conf/enums').AuthOriginEnum
  , users = require('./dbManager').users;

var authManager = module.exports = {
    addNewAcount: function(userInfo, authOrigin, callback) {
      var user = {
          nickname: userInfo.name
        , defaultAcountType: authOrigin
        , authInfo: {}
        , regDate: new Date()
      };
      user['authInfo'][authOrigin] = userInfo;

      users.insert(user, callback);
    }
  , findAcountBy: function(id, authOrigin, callback) {
      var criteria = {};
      criteria['authInfo.' + authOrigin + '.id'] = id;
      users.findOne(criteria, callback);
    }
};
