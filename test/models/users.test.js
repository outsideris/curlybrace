var should = require('should')
  , AuthOriginEnum = require('../../conf/config').AuthOriginEnum
  , dbService = require('../../app/models/dbService')
  , users = require('../../app/models/users');

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

describe('users', function() {
  var usersCollection;
  before(function() {
    var db = dbService.init({'users':'user_test'});
    usersCollection = db.users;
    users.init(db);
  });
  beforeEach(function() {
    usersCollection.remove();
  });
  describe('사용자 추가', function() {
    it('페이스북 사용자 추가', function(done) {
      users.addNewAcount(fixture.facebookInfo, AuthOriginEnum.facebook, function(err, user) {
        var criteria = {};
        criteria['authInfo.' + AuthOriginEnum.facebook + '.id'] = fixture.facebookInfo.id;
        usersCollection.findOne(criteria, function(err, user) {
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
      usersCollection.insert(fixtureUser);
      users.findAcountBy(fixture.facebookInfo.id, AuthOriginEnum.facebook, function(err, user) {
        user.should.have.property('authInfo')
                   .have.property(AuthOriginEnum.facebook)
                   .have.property('name', fixture.facebookInfo.name);
        done();
      });
    });
  });
});

