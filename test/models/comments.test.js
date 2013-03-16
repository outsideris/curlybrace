// # 답변관련 테스트
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
/*global describe, it, before, after, beforeEach */
"use strict";

var should = require('should')
  , dbService = require('../../src/models/dbService')
  , env = require('../../src/conf/config').env
  , authProvider = require('../../src/conf/config').authProvider
  , questions = require('../../src/models/questions')
  , answers = require('../../src/models/answers')
  , comments = require('../../src/models/comments')
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

describe('comments >', function() {
  var questionsCollection,
      commentsCollection,
      tagsCollection,
      countersCollection,
      usersCollection,
      currentUser,
      db,
      questionFixture,
      answerFixture,
      questionId,
      answerId;

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
      db.setComments(env.MONGODB_COLLECTION_COMMENTS + '_test');
      commentsCollection = db.comments;
      comments.init(db);

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
        questionsCollection.findOne({_id: questionId}, function(err, foundQuestion) {
          should.not.exist(err);
          answerId = foundQuestion.answers[0].id;
          done();
        });
      });
    });
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

  describe('댓글 등록 >', function() {
    it('댓글이 안달린 질문에 댓글을 등록한다', function(done) {
      // given
      var comment = {
        contents: '좋은 질문이네요.'
      };

      // when
      comments.insert({questionId: questionId}, comment, currentUser, function(err, insertedComment) {
        should.not.exist(err);

        commentsCollection.findOne({_id: {questionId: questionId }}, function(err, foundComments) {
          // then
          should.not.exist(err);
          should.exist(foundComments);
          foundComments.comments.length.should.equal(1);
          foundComments.comments[0].contents.should.equal(comment.contents);
          done();
        });
      });
    });
    it('댓글이 달린 질문에 댓글을 추가로 등록한다', function(done) {
      // given
      var comment = {
        contents: '좋은 질문이네요.'
      };

      // when
      comments.insert({questionId: questionId}, comment, currentUser, function(err, insertedComment) {
        should.not.exist(err);
        comment.contents = comment.contents + '2';
        comments.insert({questionId: questionId}, comment, currentUser, function(err, insertedComment) {
          should.not.exist(err);

          commentsCollection.findOne({_id: { questionId: questionId }}, function(err, foundComments) {
            // then
            should.not.exist(err);
            should.exist(foundComments);
            foundComments.comments.length.should.equal(2);
            foundComments.comments[1].contents.should.equal(comment.contents);
            done();
          });
        });
      });
    });
    it('댓글이 안달린 답변에 댓글을 등록한다', function(done) {
      // given
      var comment = {
        contents: '좋은 답변이네요.'
      };

      // when
      comments.insert({
        questionId: questionId,
        answerId: answerId
      }, comment, currentUser, function(err) {
        should.not.exist(err);

        // then
        commentsCollection.findOne({_id: {questionId: questionId, answerId: answerId}}, function(err, foundComments) {
          should.not.exist(err);
          should.exist(foundComments);
          foundComments.comments.length.should.equal(1);
          foundComments.comments[0].contents.should.equal(comment.contents);
          done();
        });
      });
    });
    it('댓글이 달린 답변에 추가로 댓글을 등록한다', function(done) {
      // given
      var comment = {
        contents: '좋은 답변이네요.'
      };
      // when
      comments.insert({
        questionId: questionId,
        answerId: answerId
      }, comment, currentUser, function(err) {
        should.not.exist(err);

        comment.contents = comment.contents + '2';
        comments.insert({
          questionId: questionId,
          answerId: answerId
        }, comment, currentUser, function(err) {
          should.not.exist(err);

          // then
          commentsCollection.findOne({_id: {questionId: questionId, answerId: answerId}}, function(err, foundComments) {
            should.not.exist(err);
            should.exist(foundComments);
            foundComments.comments.length.should.equal(2);
            foundComments.comments[1].contents.should.equal(comment.contents);
            done();
          });
        });
      });
    });
    it('댓글이 있는 질문에 대한 답변에 댓글을 달 수 있어야 한다', function(done) {
      // given
      var comment = {
        contents: '좋은 답변이네요.'
      };
      // when
      comments.insert({
        questionId: questionId
      }, comment, currentUser, function(err) {
        should.not.exist(err);

        comments.insert({
          questionId: questionId,
          answerId: answerId
        }, comment, currentUser, function(err) {
          should.not.exist(err);

          // then
          commentsCollection.findOne({_id: {questionId: questionId, answerId: answerId}}, function(err, foundComments) {
            should.not.exist(err);
            should.exist(foundComments);
            foundComments.comments.length.should.equal(1);
            foundComments.comments[0].contents.should.equal(comment.contents);
            done();
          });
        });
      });
    });
  });
  describe('댓글 조회', function() {
    it('질문에 달린 댓글을 조회한다', function(done) {
      // given
      var comment = {
        contents: '좋은 질문이네요.'
      };

      comments.insert({questionId: questionId}, comment, currentUser, function(err, insertedComment) {
        should.not.exist(err);
        comments.insert({questionId: questionId}, comment, currentUser, function(err, insertedComment) {
          should.not.exist(err);

          // when
          comments.findById(
            {
              questionId: questionId
            }, function(err, foundComments) {
              should.not.exist(err);
              // then
              should.exist(foundComments);
              foundComments.length.should.equal(2);
              foundComments[0].contents.should.equal(comment.contents);
              done();
            });
        });
      });
    });
    it('질문에 달린 댓글이 없는 경우에는 빈 배열을 반환한다', function(done) {
      // given
      // when
      comments.findById(
        {
          questionId: questionId
        }, function(err, foundComments) {
          should.not.exist(err);
          // then
          should.exist(foundComments);
          foundComments.length.should.equal(0);
          done();
        });
    });
    it('답변에 달린 댓글을 조회한다', function(done) {
      // given
      var comment = {
        contents: '좋은 질문이네요.'
      };

      comments.insert({questionId: questionId}, comment, currentUser, function(err) {
        should.not.exist(err);
        comments.insert({questionId: questionId}, comment, currentUser, function(err) {
          should.not.exist(err);
          comments.insert({questionId: questionId}, comment, currentUser, function(err) {
            should.not.exist(err);

            // when
            comments.findById(
              {
                questionId: questionId
              }, function(err, foundComments) {
                should.not.exist(err);
                // then
                should.exist(foundComments);
                foundComments.length.should.equal(3);
                foundComments[0].contents.should.equal(comment.contents);
                done();
              });
          });
        });
      });
    });
    it('답변에 달린 댓글이 없는 경우에는 빈 배열을 반환한다', function(done) {
      // given
      // when
      comments.findById(
        {
          questionId: questionId
        }, function(err, foundComments) {
          should.not.exist(err);
          // then
          should.exist(foundComments);
          foundComments.length.should.equal(0);
          done();
        });
    });
    it('질문에 달린 댓글의 날짜는 포매팅해야 한다', function(done) {
      // given
      var comment = {
        contents: '좋은 질문이네요.'
      };

      comments.insert({questionId: questionId}, comment, currentUser, function(err, insertedComment) {
        should.not.exist(err);
        comments.insert({questionId: questionId}, comment, currentUser, function(err, insertedComment) {
          should.not.exist(err);

          // when
          comments.findById(
            {
              questionId: questionId
            }, function(err, foundComments) {
              should.not.exist(err);
              // then
              should.exist(foundComments);
              foundComments.length.should.equal(2);
              foundComments.forEach(function(comment) {
                should.exist(comment.regDate);
                should.exist(comment.regDateFromNow);
                should.exist(comment.regDateformatted);
              });
              done();
            });
        });
      });
    });
    it('답변에 달린 댓글의 날짜는 포매팅해야 한다', function(done) {
      // given
      var comment = {
        contents: '좋은 질문이네요.'
      };

      comments.insert({questionId: questionId}, comment, currentUser, function(err) {
        should.not.exist(err);
        comments.insert({questionId: questionId}, comment, currentUser, function(err) {
          should.not.exist(err);
          comments.insert({questionId: questionId}, comment, currentUser, function(err) {
            should.not.exist(err);

            // when
            comments.findById(
              {
                questionId: questionId
              }, function(err, foundComments) {
                should.not.exist(err);
                // then
                should.exist(foundComments);
                foundComments.length.should.equal(3);
                foundComments.forEach(function(comment) {
                  should.exist(comment.regDate);
                  should.exist(comment.regDateFromNow);
                  should.exist(comment.regDateformatted);
                });
                done();
              });
          });
        });
      });
    });
  });
});