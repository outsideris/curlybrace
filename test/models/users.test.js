var should = require('should')
  , authProvider = require('../../conf/config').authProvider
  , dbService = require('../../app/models/dbService')
  , users = require('../../app/models/users')
  , logger = require('../../conf/config').logger;

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
  var db;
  before(function(done) {
    db = dbService.init();
    db.once('connected', function(err, pdb) {
      db = pdb;
      db.setUsers('users_test');
      usersCollection = db.users;
      users.init(db);
      done();
    });
  });
  beforeEach(function() {
    usersCollection.remove();
  });
  after(function() {
    usersCollection.remove();
    db.db.close();
    db.db = null;
  });
  describe('사용자 추가', function() {
    it('페이스북 사용자 추가', function(done) {
      users.insert(fixture.facebookInfo, authProvider.facebook.name, function(err, user) {
        var criteria = {};
        criteria['authInfo.' + authProvider.facebook.name + '.id'] = fixture.facebookInfo.id;
        usersCollection.findOne(criteria, function(err, user) {
          should.exist(user);
          user.should.have.property('authInfo')
                     .have.property(authProvider.facebook.name)
                     .have.property('name', fixture.facebookInfo.name);
          done();
        });
      });
    });
    it('페이스북 사용자 찾기', function(done) {
      var fixtureUser = {
          nickname: fixture.facebookInfo.name
        , defaultAcountType: authProvider.facebook.name
        , authInfo: {}
        , regDate: new Date()
      };
      fixtureUser['authInfo'][authProvider.facebook.name] = fixture.facebookInfo;
      usersCollection.insert(fixtureUser);
      users.findOneBy(fixture.facebookInfo.id, authProvider.facebook.name, function(err, user) {
        user.should.have.property('authInfo')
                   .have.property(authProvider.facebook.name)
                   .have.property('name', fixture.facebookInfo.name);
        done();
      });
    });
    it('ObjectId 객체로 사용자 찾기', function(done) {
      // given
      var fixtureUser = {
        nickname: fixture.facebookInfo.name
        , defaultAcountType: authProvider.facebook.name
        , authInfo: {}
        , regDate: new Date()
      };
      fixtureUser['authInfo'][authProvider.facebook.name] = fixture.facebookInfo;
      usersCollection.insert(fixtureUser, function(err, result) {
        should.not.exist(err);
        var insertedObjectID = result[0]._id;

        // when
        users.findOneByObjectId(insertedObjectID, function(err, user) {
          //then
          should.not.exist(err);
          user.should.have.property('authInfo')
            .have.property(authProvider.facebook.name)
            .have.property('name', fixture.facebookInfo.name);
          done();
        });
      });
    });
    it('ObjectId 문자열로 사용자 찾기', function(done) {
      // given
      var fixtureUser = {
        nickname: fixture.facebookInfo.name
        , defaultAcountType: authProvider.facebook.name
        , authInfo: {}
        , regDate: new Date()
      };
      fixtureUser['authInfo'][authProvider.facebook.name] = fixture.facebookInfo;
      usersCollection.insert(fixtureUser, function(err, result) {
        should.not.exist(err);
        var insertedObjectID = result[0]._id;

        // when
        users.findOneByObjectId(insertedObjectID.toString(), function(err, user) {
          //then
          should.not.exist(err);
          user.should.have.property('authInfo')
            .have.property(authProvider.facebook.name)
            .have.property('name', fixture.facebookInfo.name);
          done();
        });
      });
    });
  });
});

