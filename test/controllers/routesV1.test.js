// # API v1 라우팅 테스트
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
/*global describe, it, before, after, beforeEach */
"use strict";

var should = require('should')
  , http = require('http')
  , env = require('../../src/conf/config').env
  , dbService = require('../../src/models/dbService')
  , authProvider = require('../../src/conf/config').authProvider
  , questions = require('../../src/models/questions')
  , answers = require('../../src/models/answers')
  , comments = require('../../src/models/comments')
  , counters = require('../../src/models/counters')
  , tags = require('../../src/models/tags')
  , users = require('../../src/models/users')
  , tagFixture = require('../models/tags.test').tagFixture;

var userFixture = {
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
      updated_time: '2011-06-09T04:22:15+0000',
      picture: {
        data: {
          url: ''
        }
      }
    },
    displayName: 'Test User'
  }
};

describe('API V1 >', function() {
  var server;
  var db;

  describe('태그명의 일부로 조회한다 >', function() {
    before(function(done) {
      db = dbService.init();
      db.once('connected', function(err, pdb) {
        db = pdb;
        done();
      });
      server = require('../../app');
      server.httpd.listen(env.PORT);
    });
    after(function() {
      db.db.close();
      db.db = null;
    });

    it('application/json으로 요청할 경우 JSON을 리턴한다', function(done) {
      // given
      // when
      http.get({
        path: '/v1/tags?q=jav&how=startWith'
        , port: env.PORT
        , 'Accept': 'application/json'
      }, function(res) {
        // then
        res.should.be.json;
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          JSON.parse(chunk).success.should.be.true;
        });
        done();
      });
    });
  });

  describe('댓글을 조회한다 >', function() {
    var questionFixture,
        answerFixture,
        questionId,
        answerId,
        questionsCollection,
        commentsCollection,
        countersCollection,
        tagsCollection,
        usersCollection,
        currentUser;

    before(function(done) {
      db = dbService.init();
      db.once('connected', function(err, pdb) {
        db = pdb;
        // 질문 컬렉션 설정
        db.setQuestions(env.MONGODB_COLLECTION_QUESTIONS + '_test');
        questionsCollection = db.questions;
        questions.init(db);
        answers.init(db);
        db.setComments(env.MONGODB_COLLECTION_COMMENTS + '_test');
        commentsCollection = db.comments;
        comments.init(db);

        // 카운터 컬렉션 설정
        db.setCounters(env.MONGODB_COLLECTION_COUNTERS + '_test');
        countersCollection = db.counters;
        counters.init(db);

        // 태그 컬렉션 설정
        db.setTags(env.MONGODB_COLLECTION_TAGS + '_test');
        tagsCollection = db.tags;
        tagsCollection.insert(tagFixture, function(err, result) {
          should.not.exist(err);
          should.exist(result);
        });
        tags.init(db);

        // 사용자 컬렉션 설정
        db.setUsers(env.MONGODB_COLLECTION_USERS + '_test');
        usersCollection = db.users;
        users.init(db);
        // 픽스처 사용자 데이터 추가
        users.insert(userFixture.facebookInfo, authProvider.facebook.name, function(err, user) {
          should.not.exist(err);
          should.exist(user[0]);
          currentUser = user[0];
          done();
        });
      });
      server = require('../../app');
      server.httpd.listen(env.PORT);
    });
    after(function() {
      questionsCollection.remove(function(err, numberOfRemovedDocs) {
        should.not.exist(err);
        should.exist(numberOfRemovedDocs);
      });
      countersCollection.remove(function(err, numberOfRemovedDocs) {
        should.not.exist(err);
        should.exist(numberOfRemovedDocs);
      });
      tagsCollection.remove(function(err, numberOfRemovedDocs) {
        should.not.exist(err);
        should.exist(numberOfRemovedDocs);
      });
      usersCollection.remove(function(err, numberOfRemovedDocs) {
        should.not.exist(err);
        should.exist(numberOfRemovedDocs);
      });
      db.db.close();
      db.db = null;
    });
    beforeEach(function(done) {
      commentsCollection.remove(function(err, numberOfRemovedDocs) {
        should.not.exist(err);
        should.exist(numberOfRemovedDocs);
      });

      questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: 'scala,javascript'
      };
      answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);
        should.exist(insertedQuestion[0]);
        questionId = insertedQuestion[0]._id;

        answers.insert(questionId, answerFixture, currentUser, function(err, updatedCount) {
          should.not.exist(err);
          updatedCount.should.equal(1);
          questionsCollection.findOne({_id: questionId}, function(err, foundQuestion) {
            should.not.exist(err);
            answerId = foundQuestion.answers[0].id;
            done();
          });
        });
      });
    });

    it('댓글 목록을 application/json으로 요청할 경우 JSON으로 댓글을 반환한다', function(done) {
      // given
      var comment = {
        contents: '좋은 질문이네요.'
      };

      comments.insert({
        questionId: questionId
      }, comment, currentUser, function(err) {
        should.not.exist(err);

        // when
        http.get({
          path: '/v1/question/' + questionId + '/comments',
          port: env.PORT,
          'Accept': 'application/json'
        }, function(res) {
          // then
          res.should.be.json;
          res.setEncoding('utf8');
          res.on('data', function(chunk) {
            JSON.parse(chunk).success.should.be.true;
            done();
          });
        });
      });
    });
    it('질문에 달린 댓글 목록을 조회한다', function(done) {
      // given
      var comment = {
        contents: '좋은 질문이네요.'
      };

      comments.insert({
        questionId: questionId
      }, comment, currentUser, function(err) {
        should.not.exist(err);
        comments.insert({
          questionId: questionId
        }, comment, currentUser, function(err) {

          // when
          http.get({
            path: '/v1/question/' + questionId + '/comments',
            port: env.PORT,
            'Accept': 'application/json'
          }, function(res) {
            // then
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
              var data = JSON.parse(chunk);
              data.success.should.be.true;
              data.results.length.should.equal(2);
              data.results[0].contents.should.equal(comment.contents);
              done();
            });
          });
        });
      });
    });
    it('질문에 달린 댓글이 없는 경우에는 빈 배열을 반환한다', function(done) {
      // given
      // when
      http.get({
        path: '/v1/question/' + questionId + '/comments',
        port: env.PORT,
        'Accept': 'application/json'
      }, function(res) {
        // then
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          var data = JSON.parse(chunk);
          console.log(data);
          data.success.should.be.true;
          data.results.length.should.equal(0);
          done();
        });
      });
    });
    it('답변에 달린 댓글 목록을 조회한다', function(done) {
      // given
      var comment = {
        contents: '좋은 답변이네요.'
      };

      comments.insert({
        questionId: questionId,
        answerId: answerId
      }, comment, currentUser, function(err) {
        should.not.exist(err);
        comments.insert({
          questionId: questionId,
          answerId: answerId
        }, comment, currentUser, function(err) {

          // when
          http.get({
            path: '/v1/question/' + questionId + '/answer/' + answerId + '/comments',
            port: env.PORT,
            'Accept': 'application/json'
          }, function(res) {
            // then
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
              var data = JSON.parse(chunk);
              data.success.should.be.true;
              data.results.length.should.equal(2);
              data.results[0].contents.should.equal(comment.contents);
              done();
            });
          });
        });
      });
    });
    it('답변에 달린 댓글이 없는 경우에는 빈 배열을 반환한다', function(done) {
      // given
      // when
      http.get({
        path: '/v1/question/' + questionId + '/answer/' + answerId + '/comments',
        port: env.PORT,
        'Accept': 'application/json'
      }, function(res) {
        // then
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          var data = JSON.parse(chunk);
          data.success.should.be.true;
          data.results.length.should.equal(0);
          done();
        });
      });
    });
  });
});

