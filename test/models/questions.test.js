// # 질문 모델 테스트
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
/*global describe:true, it:true, before:true, after:true, beforeEach:true */
"use strict";

var should = require('should')
  , dbService = require('../../src/models/dbService')
  , env = require('../../src/conf/config').env
  , authProvider = require('../../src/conf/config').authProvider
  , questions = require('../../src/models/questions')
  , answers = require('../../src/models/answers')
  , tags = require('../../src/models/tags')
  , counters = require('../../src/models/counters')
  , tagFixture = require('./tags.test').tagFixture
  , users = require('../../src/models/users')
  , moment = require('moment');

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

describe('questions', function() {
  var questionsCollection,
      tagsCollection,
      countersCollection,
      usersCollection,
      currentUser,
      db;

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
  });
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

  describe('질문 등록', function() {
    it('기본적인 질문을 등록한다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: 'scala,javascript'
      };

      // when
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        // then
        should.not.exist(err);
        should.exist(insertedQuestion[0]);
        done();
      });
    });
    it('질문 등록시 사용자 정보를 저장한다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: 'scala,javascript'
      };

      // when
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);
        should.exist(insertedQuestion[0]);
        questionsCollection.findOne({_id: insertedQuestion[0]._id}, function(err, question) {
          // then
          should.not.exist(err);
          question.author.nickname.should.equal(currentUser.nickname);
          question.author.id.should.equal(currentUser._id);
          done();
        });

      });
    });
    it('제목이 없는 경우 등록할 수 없다', function(done){
      // given
      var questionFixture = {
        title: '',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: 'scala,javascript'
      };

      // when
      questions.insert(questionFixture, currentUser, function(err) {
        // then
        should.exist(err);
        done();
      });
    });
    it('본문이 없는 경우 등록할 수 없다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '',
        tags: 'scala,javascript'
      };

      // when
      questions.insert(questionFixture, currentUser, function(err) {
        // then
        should.exist(err);
        done();
      });
    });
    it('태그가 없는 경우 등록할 수 없다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: ''
      };

      // when
      questions.insert(questionFixture, currentUser, function(err) {
        // then
        should.exist(err);
        done();
      });
    });
    it('태그는 배열로 변환해서 등록한다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: 'scala,javascript'
      };
      var originTags = questionFixture.tags;
      // when
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        // then
        should.not.exist(err);
        insertedQuestion[0].tags.should.eql(originTags.split(','));
        done();
      });
    });
    it('등록되지 않은 태그가 있는 경우에는 등록할 수 없다.', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: 'scala,javascript,notExistTagName'
      };

      // when
      questions.insert(questionFixture, currentUser, function(err) {
        // then
        should.exist(err);
        done();
      });
    });
    it('질문을 등록하면 글번호가 순차적으로 증가한다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: 'scala,javascript'
      };
      var questionFixture2 = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: 'scala,javascript'
      };

      // when
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        var beforeSeq = insertedQuestion[0]._id;
        questions.insert(questionFixture2, currentUser, function(err, insertedQuestion) {
          // then
          should.not.exist(err);
          should.exist(insertedQuestion[0]);
          beforeSeq.should.be.equal(insertedQuestion[0]._id - 1);
          done();
        });
      });
    });
    it('질문 본문을 가져올 때 마크다운을 HTML로 렌더링한다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "test"',
        tags: 'scala,javascript'
      };

      // when
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        questions.findOneById(insertedQuestion[0]._id, function(err, foundQuestion) {
          // then
          should.not.exist(err);

          var expectHTML = '<h1>본문입니다.</h1><ul><li>질문</li><li><p>질문..</p><pre><code>var a = &quot;test&quot;</code></pre></li></ul>';
          var actualHTML = foundQuestion.renderedContents.replace(/\n|\r/g, '');
          actualHTML.should.equal(expectHTML);
          done();
        });
      });
    });
    it('id로 질문을 가져올 때 id가 숫자 타입이 아니면 오류를 발생한다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "test"',
        tags: 'scala,javascript'
      };

      // when
      questions.findOneById('test', function(err) {
        // then
        should.exist(err);
        done();
      });
    });
    it('질문을 등록했을 때 투표수/조회수를 초기화한다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: 'scala,javascript'
      };

      // when
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        // then
        should.not.exist(err);
        insertedQuestion[0].voteUp.should.equal(0);
        insertedQuestion[0].voteDown.should.equal(0);
        insertedQuestion[0].viewCount.should.equal(0);

        done();
      });
    });
    it('질문을 가져올 때 뷰에서 필요한 날짜형식으로 포매팅해서 반환한다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "test"',
        tags: 'scala,javascript'
      };

      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        // when
        questions.findOneById(insertedQuestion[0]._id, function(err, foundQuestion) {
          // then
          should.not.exist(err);

          should.exist(foundQuestion.regDate);
          should.exist(foundQuestion.regDateFromNow);
          should.exist(foundQuestion.regDateformatted);
          done();
        });
      });
    });
    it('질문을 가져올 때 답변의 날짜도 뷰에 필요한 형식으로 포매팅한다', function(done) {
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "test"',
        tags: 'scala,javascript'
      };
      var answerFixture = {
        contents: '#답변내용입니다.\r\n\r\n* 어쩌구\r\n* 저쩌구..\r\n\r\n        var a = "tet"'
      };

      // given
      questions.insert(questionFixture, currentUser, function(err, insertedQuestion) {
        should.not.exist(err);

        answers.insert(insertedQuestion[0]._id, answerFixture, currentUser, function(err, updatedCount) {
          should.not.exist(err);
          updatedCount.should.equal(1);

          // when
          questions.findOneById(insertedQuestion[0]._id, function(err, foundQuestion) {
            // then
            should.not.exist(err);

            foundQuestion.answers.length.should.equal(1);
            should.exist(foundQuestion.answers[0].regDate);
            should.exist(foundQuestion.answers[0].regDateFromNow);
            should.exist(foundQuestion.answers[0].regDateformatted);
            done();
          });
        });
      });
    });
  });
});

