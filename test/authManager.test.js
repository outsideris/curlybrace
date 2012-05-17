var should = require('should')
  , AuthOriginEnum = require('../conf/enums').AuthOriginEnum
  , dbManager = require('../libs/dbManager')
  , authManager = require('../libs/authManager')
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
  var users;
  before(function() {
    var db = dbManager.init({'users':'user_test'});
    users = db.users;
    authManager.init(db);
  });
  beforeEach(function() {
    users.remove();
  });
  describe('사용자 추가', function() {
    it('페이스북 사용자 추가', function(done) {
      authManager.addNewAcount(fixture.facebookInfo, AuthOriginEnum.facebook, function(err, user) {
        var criteria = {};
        criteria['authInfo.' + AuthOriginEnum.facebook + '.id'] = fixture.facebookInfo.id;
        users.findOne(criteria, function(err, user) {
          should.exist(user);
          user.should.have.property('authInfo')
                     .have.property(AuthOriginEnum.facebook)
                     .have.property('name', fixture.facebookInfo.name);
          done();
        });
      });
    });
    it('페이스북 사용자 찾기', function(done) {
      var fixtureUser = {
          nickname: fixture.facebookInfo.name
        , defaultAcountType: AuthOriginEnum.facebook
        , authInfo: {}
        , regDate: new Date()
      };
      fixtureUser['authInfo'][AuthOriginEnum.facebook] = fixture.facebookInfo;
      users.insert(fixtureUser);
      authManager.findAcountBy(fixture.facebookInfo.id, AuthOriginEnum.facebook, function(err, user) {
        user.should.have.property('authInfo')
                   .have.property(AuthOriginEnum.facebook)
                   .have.property('name', fixture.facebookInfo.name);
        done();
      });
    });
  });
});

