"use strict";

var should = require('should')
  , dbService = require('../../app/models/dbService')
  , questions = require('../../app/models/qna').questions
  , tags = require('../../app/models/tags')
  , tagFixture = require('./tags.test').tagFixture;

describe('questions', function() {
  var questionsCollection, tagsCollection;
  var db;
  before(function(done) {
    db = dbService.init();
    db.once('connected', function(err, pdb) {
      db = pdb;
      db.setUsers('questions_test');
      questionsCollection = db.questions;
      questions.init(db);

      db.setTags('tags_test');
      tagsCollection = db.tags;
      tagsCollection.insert(tagFixture, function(err, result) {
        should.not.exist(err);
        should.exist(result);
      });
      tags.init(db);
      done();
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
      questions.insert(questionFixture, function(err, insertedQuestion) {
        // then
        should.not.exist(err);
        should.exist(insertedQuestion);
        done();
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
      questions.insert(questionFixture, function(err) {
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
      questions.insert(questionFixture, function(err) {
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
      questions.insert(questionFixture, function(err) {
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
      questions.insert(questionFixture, function(err, insertedQuestion) {
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
      questions.insert(questionFixture, function(err) {
        // then
        should.exist(err);
        done();
      });
    });
    it('등록된 질문은 글 번호를 반환한다', function(done) {
      // given
      var questionFixture = {
        title: '테스트 제목',
        contents: '#본문입니다.\r\n\r\n* 질문\r\n* 질문..\r\n\r\n        var a = "tet"',
        tags: 'scala,javascript'
      };

      // when
      questions.insert(questionFixture, function(err, insertedQuestion) {
        // then
        should.not.exist(err);
        should.exist(insertedQuestion);
        done();
      });
    });
    it.skip('질문 내용을 가져올 때 마크다운을 HTML로 렌더링한다', function(done) {

    });
  });
});

