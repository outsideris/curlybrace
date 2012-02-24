var should = require('should')
  , dbManager = require('../libs/dbManager')
  , CONST = require('../conf/constant');

var fixture = {
    facebookInfo: { id: '123456789',
      name: 'Test User',
      first_name: 'Test',
      last_name: 'User',
      link: 'http://www.facebook.com/',
      username: 'testuser',
      location: { id: '108259475871818', name: 'Seoul, Korea' },
      gender: 'male',
      timezone: 9,
      locale: 'ko_KR',
      verified: true,
      updated_time: '2011-06-09T04:22:15+0000'
    }
};

describe('authManager', function() {
  var authManager;
  before(function() {
    dbManager.setUsers(CONST.MONGODB_COLLECTION_USERS + '_test');
    authManager = require('../libs/authManager')
  });
  beforeEach(function() {
    dbManager.getUsers().remove();
  });
  describe('사용자 추가', function() {
    it('페이스북 사용자 추가', function(done) {
      authManager.addNewAcount(fixture.facebookInfo, 'facebook', function(err, value) {
        console.log('error: ' + err);
        console.log(value);
        done();
      });
    });
  });
});

