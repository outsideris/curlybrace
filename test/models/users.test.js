// # 사용자 모델 테스트
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
/*global describe:true, it:true, before:true, after:true, beforeEach:true */
"use strict";

var should = require('should')
  , authProvider = require('../../src/conf/config').authProvider
  , dbService = require('../../src/models/dbService')
  , env = require('../../src/conf/config').env
  , users = require('../../src/models/users')
  , counters = require('../../src/models/counters');

var fixture = {
  facebookInfo: {
    _json:  { id: '123456789',
      name: 'Test User',
      first_name: 'Test',
      last_name: 'User',
      displayName: 'Test User',
      link: 'http://www.facebook.com/',
      username: 'testuser',
      location: { id: '108259475871818', name: 'Seoul, Korea' },
      gender: 'male',
      timezone: 9,
      locale: 'ko_KR',
      verified: true,
      updated_time: '2011-06-09T04:22:15+0000'
    },
    displayName: 'Test User'
  }
};

describe('users', function() {
  var usersCollection,
      countersCollection,
      db;

  before(function(done) {
    db = dbService.init();
    db.once('connected', function(err, pdb) {
      should.not.exist(err);
      db = pdb;
      // 사용자 컬렉션 설정
      db.setUsers(env.MONGODB_COLLECTION_USERS + '_test');
      usersCollection = db.users;
      users.init(db);

      // 카운터 컬렉션 설정
      db.setCounters(env.MONGODB_COLLECTION_COUNTERS + '_test');
      countersCollection = db.counters;
      counters.init(db);

      done();
    });
  });
  beforeEach(function() {
    usersCollection.remove(function(err, numberOfRemovedDocs) {
      should.not.exist(err);
      should.exist(numberOfRemovedDocs);
    });
  });
  after(function() {
    usersCollection.remove(function(err, numberOfRemovedDocs) {
      should.not.exist(err);
      should.exist(numberOfRemovedDocs);
    });
    countersCollection.remove(function(err, numberOfRemovedDocs) {
      should.not.exist(err);
      should.exist(numberOfRemovedDocs);
    });
    db.db.close();
    db.db = null;
  });
  describe('사용자 추가', function() {
    it('페이스북 사용자 추가', function(done) {
      // given
      users.insert(fixture.facebookInfo, authProvider.facebook.name, function(err, user) {
        should.not.exist(err);
        should.exist(user[0]);

        // when
        var criteria = {};
        criteria['authInfo.' + authProvider.facebook.name + '.id'] = fixture.facebookInfo._json.id;
        usersCollection.findOne(criteria, function(err, user) {
          // then
          should.exist(user);
          user.should.have.property('authInfo')
                     .have.property(authProvider.facebook.name)
                     .have.property('nickname', fixture.facebookInfo._json.name);
          done();
        });
      });
    });
    it('페이스북 사용자 찾기', function(done) {
      // given
      var fixtureUser = {
          nickname: fixture.facebookInfo._json.name
        , defaultAcountType: authProvider.facebook.name
        , authInfo: {}
        , regDate: new Date()
      };
      fixtureUser.authInfo[authProvider.facebook.name] = fixture.facebookInfo._json;
      usersCollection.insert(fixtureUser, function(err, result) {
        should.not.exist(err);
        should.exist(result);
      });

      // when
      users.findOneBy(fixture.facebookInfo._json.id, authProvider.facebook.name, function(err, user) {
        // then
        user.should.have.property('authInfo')
                   .have.property(authProvider.facebook.name)
                   .have.property('name', fixture.facebookInfo._json.name);
        done();
      });
    });
    it('ObjectId 객체로 사용자 찾기', function(done) {
      // given
      var fixtureUser = {
        nickname: fixture.facebookInfo._json.name
        , defaultAcountType: authProvider.facebook.name
        , authInfo: {}
        , regDate: new Date()
      };
      fixtureUser.authInfo[authProvider.facebook.name] = fixture.facebookInfo._json;
      usersCollection.insert(fixtureUser, function(err, result) {
        should.not.exist(err);
        var insertedObjectID = result[0]._id;

        // when
        users.findOneByObjectId(insertedObjectID, function(err, user) {
          //then
          should.not.exist(err);
          should.exist(user);
          user.should.have.property('authInfo')
            .have.property(authProvider.facebook.name)
            .have.property('name', fixture.facebookInfo._json.name);
          done();
        });
      });
    });
    it('ObjectId 문자열로 사용자 찾기', function(done) {
      // given
      var fixtureUser = {
        nickname: fixture.facebookInfo._json.name
        , defaultAcountType: authProvider.facebook.name
        , authInfo: {}
        , regDate: new Date()
      };
      fixtureUser.authInfo[authProvider.facebook.name] = fixture.facebookInfo._json;
      usersCollection.insert(fixtureUser, function(err, result) {
        should.not.exist(err);
        var insertedObjectID = result[0]._id;

        // when
        users.findOneByObjectId(insertedObjectID.toString(), function(err, user) {
          //then
          should.not.exist(err);
          user.should.have.property('authInfo')
            .have.property(authProvider.facebook.name)
            .have.property('name', fixture.facebookInfo._json.name);
          done();
        });
      });
    });
    it('사용자 추가시 아이디가 순차적으로 증가한다', function(done) {
      // given
      var facebookFixture = {
        _json:  { id: '123456789',
          name: 'Test User',
          first_name: 'Test',
          last_name: 'User',
          displayName: 'Test User',
          link: 'http://www.facebook.com/',
          username: 'testuser',
          location: { id: '108259475871818', name: 'Seoul, Korea' },
          gender: 'male',
            timezone: 9,
            locale: 'ko_KR',
            verified: true,
            updated_time: '2011-06-09T04:22:15+0000'
        },
        displayName: 'Test User'
      };
      var facebookFixture2 = {
        _json:  { id: '123456789',
          name: 'Test User',
          first_name: 'Test',
          last_name: 'User',
          displayName: 'Test User',
          link: 'http://www.facebook.com/',
          username: 'testuser',
          location: { id: '108259475871818', name: 'Seoul, Korea' },
          gender: 'male',
          timezone: 9,
          locale: 'ko_KR',
          verified: true,
          updated_time: '2011-06-09T04:22:15+0000'
        },
        displayName: 'Test User 2'
      };

      // when
      users.insert(facebookFixture, authProvider.facebook.name, function(err, insertedUser) {
        var beforeSeq = insertedUser[0]._id;
        users.insert(facebookFixture2, authProvider.facebook.name, function(err, insertedUser) {
          // then
          should.not.exist(err);
          should.exist(insertedUser[0]);
          beforeSeq.should.be.equal(insertedUser[0]._id - 1);
          done();
        });
      });
    });
  });
});

