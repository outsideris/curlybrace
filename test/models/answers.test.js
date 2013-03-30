// # 답변관련 테스트
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
/*global describe, it, before, after, beforeEach*/
"use strict";

var should = require('should')
  , dbService = require('../../src/models/dbService')
  , env = require('../../src/conf/config').env
  , authProvider = require('../../src/conf/config').authProvider
  , questions = require('../../src/models/questions')
  , answers = require('../../src/models/answers')
  , tags = require('../../src/models/tags')
  , counters = require('../../src/models/counters')
  , users = require('../../src/models/users')
  , tagFixture = require('./tags.test').tagFixture;

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

describe('answers >', function() {
  var questionsCollection,
      tagsCollection,
      countersCollection,
      usersCollection,
      currentUser,
      db,
      questionFixture;

  before(function(done) {
    db = dbService.init();
    db.once('connected', function(err, pdb) {
      should.not.exist(err);
      db = pdb;
      // 질문 컬렉션 설정
      db.setQuestions(env.MONGODB_COLLECTION_QUESTIONS + '_test');
      questionsCollection = db.questions;
      questions.init(db);
      answers.init(db);

      // 태그 컬렉션 설정
      db.setTags(env.MONGODB_COLLECTION_TAGS + '_test');
      tagsCollection = db.tags;
      tagsCollection.insert(tagFixture, function(err, result) {
        should.not.exist(err);
        should.exist(result);
      });
      tags.init(db);

      // 카운터 컬렉션 설정
      db.setCounters(env.MONGODB_COLLECTION_COUNTERS + '_test');
      countersCollection = db.counters;
      counters.init(db);

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
  });
  beforeEach(function() {
    questionsCollection.remove(function(err, numberOfRemovedDocs) {
      should.not.exist(err);
      should.exist(numberOfRemovedDocs);
    });

    questionFixture = {
      title: '테스트 제목',
      contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
      tags: 'scala,javascript'
    };
  });
  // 테스트 데이터 삭제
  after(function() {
    questionsCollection.remove(function(err, numberOfRemovedDocs) {
      should.not.exist(err);
      should.exist(numberOfRemovedDocs);
    });
    tagsCollection.remove(function(err, numberOfRemovedDocs) {
      should.not.exist(err);
      should.exist(numberOfRemovedDocs);
    });
    countersCollection.remove(function(err, numberOfRemovedDocs) {
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

  describe('답변 등록 >', function() {
    it('답변이 안달린 질문에 답변을 등록한다', function(done) {
      var answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      // given
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        // when
        answers.insert(insertedQuestion[0]._id, answerFixture, currentUser, function(err, updatedCount) {
          // then
          should.not.exist(err);
          updatedCount.should.equal(1);

          questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
            question.answers.length.should.equal(1);
            question.answers[0].contents.should.equal(answerFixture.contents);
            done();
          });
        });
      });
    });
    it('답변이 달린 질문에 답변을 추가로 등록한다', function(done) {
      var answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };
      var answerFixture2 = {
        contents: '#답변내용2 입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      // given
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        // when
        answers.insert(insertedQuestion[0]._id, answerFixture, currentUser, function(err, updatedCount) {
          answers.insert(insertedQuestion[0]._id, answerFixture2, currentUser, function(err, updatedCount) {
            // then
            should.not.exist(err);
            updatedCount.should.equal(1);

            questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
              question.answers.length.should.equal(2);
              question.answers[0].contents.should.equal(answerFixture.contents);
              question.answers[1].contents.should.equal(answerFixture2.contents);
              done();
            });
          });
        });
      });
    });
    it('각 답변은 유일한 ID를 가진다', function(done) {
      var answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      // given
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        // when
        answers.insert(insertedQuestion[0]._id, answerFixture, currentUser, function(err, updatedCount) {
          // then
          should.not.exist(err);
          updatedCount.should.equal(1);

          questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
            should.exist(question.answers[0].id);
            done();
          });
        });
      });
    });
    it('질문 ID를 문자열로 전달해도 등록할 수 있어야 한다', function(done) {
      var answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      // given
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        // when
        answers.insert(insertedQuestion[0]._id + "", answerFixture, currentUser, function(err, updatedCount) {
          // then
          should.not.exist(err);
          updatedCount.should.equal(1);

          questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
            question.answers.length.should.equal(1);
            question.answers[0].contents.should.equal(answerFixture.contents);
            done();
          });
        });
      });
    });
    it('질문 ID를 숫자가 아닌 경우에는 오류를 반환한다', function(done) {
      var answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      // given
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        // when
        answers.insert('notNumber', answerFixture, currentUser, function(err, updatedCount) {
          // then
          should.exist(err);
          done();
        });
      });
    });
    it('답변이 등록시 사용자 정보를 저장한다', function(done) {
      var answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      // given
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        // when
        answers.insert(insertedQuestion[0]._id, answerFixture, currentUser, function(err, updatedCount) {
          // then
          should.not.exist(err);
          updatedCount.should.equal(1);

          questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
            question.answers.length.should.equal(1);
            question.answers[0].author.nickname.should.equal(currentUser.nickname);
            question.answers[0].author.id.should.equal(currentUser._id);
            done();
          });
        });
      });
    });
  });
  describe('댓글 갯수 >', function() {
    it('답변의 댓글 갯수를 1로 갱신한다', function(done) {
      var answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      // given
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        answers.insert(insertedQuestion[0]._id, answerFixture, currentUser, function(err, updatedCount) {
          should.not.exist(err);

          questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
            should.not.exist(err);
            question.answers.length.should.equal(1);

            var answerId = question.answers[0].id;

            // when
            answers.increaseComment(insertedQuestion[0]._id, answerId, 1, function(err, updatedCount) {
              should.not.exist(err);
              question.answers.length.should.equal(1);

              // then
              questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
                should.not.exist(err);
                question.answers.length.should.equal(1);
                question.answers[0].commentCount.should.equal(1);
                done();
              });
            });
          });
        });
      });
    });
    it('답변의 댓글 갯수를 3으로 갱신한다', function(done) {
      var answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      // given
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        answers.insert(insertedQuestion[0]._id, answerFixture, currentUser, function(err, updatedCount) {
          should.not.exist(err);

          questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
            should.not.exist(err);
            question.answers.length.should.equal(1);

            var answerId = question.answers[0].id;

            // when
            answers.increaseComment(insertedQuestion[0]._id, answerId, 3, function(err, updatedCount) {
              should.not.exist(err);
              question.answers.length.should.equal(1);

              // then
              questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
                should.not.exist(err);
                question.answers.length.should.equal(1);
                question.answers[0].commentCount.should.equal(3);
                done();
              });
            });
          });
        });
      });
    });
    it('답변이 여러개 있을 경우 특정 답변의 댓글 갯수만 갱신한다', function(done) {
      var answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      // given
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        answers.insert(insertedQuestion[0]._id, answerFixture, currentUser, function(err, updatedCount) {
          should.not.exist(err);

          answers.insert(insertedQuestion[0]._id, answerFixture, currentUser, function(err, updatedCount) {
          should.not.exist(err);

            questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
              should.not.exist(err);
              question.answers.length.should.equal(2);

              var answerId = question.answers[1].id;

              // when
              answers.increaseComment(insertedQuestion[0]._id, answerId, 3, function(err, updatedCount) {
                should.not.exist(err);

                // then
                questionsCollection.findOne({'_id': insertedQuestion[0]._id}, function(err, question) {
                  should.not.exist(err);

                  question.answers.length.should.equal(2);
                  question.answers[1].commentCount.should.equal(3);
                  should.not.exist(question.answers[0].commentCount);
                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});