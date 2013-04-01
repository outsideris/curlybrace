// # 답변 관련 모델
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
"use strict";
// Module dependencies.
var helpers = require('./helpers')
  , env = require('../../src/conf/config').env
  , tags = require('./tags')
  , counters = require('./counters')
  , markdown = require('markdown').markdown
  , logger = require('../../src/conf/config').logger;

module.exports = (function() {
  // 답변은 질문에 임베딩하므로 questions 컬렉션을 사용한다.
  var questions = null;

  // 컬렉션 인스턴스 할당 여부
  var isInited = function(callback) {
    logger.debug('questions.isInited', {collectionName: questions.collectionName});
    if (questions) {
      return true;
    } else {
      callback(new Error('questions collection should not be null.'));
      return false;
    }
  };

  return {
    // 컬렉션 인스턴스 할당
    init: function(db) {
      logger.debug('answers.init');
      questions = db.questions;
    },
    // 질문에 답변을 추가한다.
    insert: function(questionId, answer, user, callback) {
      logger.debug('answers.insert', {questionId: questionId, answer: answer, user: user});
      if (!isInited(callback)) { return false; }

      // validation
      if(!helpers.validateNumericType({questionId: questionId}, callback)) {
        return false;
      }
      if(!helpers.validateNotEmpty({user: user}, callback)) { return false;}

      // normalize
      questionId = parseInt(questionId, 10);

      // 답변에 필요한 필드 생성
      answer.id = helpers.generateUUID();
      answer.regDate = new Date();
      answer.voteUp = 0;
      answer.voteDown = 0;
      // 사용자 정보 복사
      answer.author = {};
      answer.author.id = user._id;
      answer.author.nickname = user.nickname;
      answer.author.profileImage = user.authInfo[user.defaultProvider].profileImage;

      questions.update(
        {_id: questionId},
        {$push: {answers: answer}},
        callback
      );
    },
    // 댓글 갯수를 증가시킨다.
    increaseCommentCount: function(questionId, answerId, commentCount, callback) {
      logger.debug('answers.increaseCommentCount', {questionId: questionId, answerId: answerId, commentCount: commentCount});
      if (!isInited(callback)) { return false; }

      // validation
      if(!helpers.validateNumericType({questionId: questionId, commentCount: commentCount}, callback)) {
        return false;
      }
      if(!helpers.validateNotEmpty({answerId: answerId}, callback)) { return false;}

      // normalize
      questionId = parseInt(questionId, 10);
      commentCount = parseInt(commentCount, 10);

      questions.update(
        {
          _id: questionId,
          'answers.id': answerId
        },
        { $set: { 'answers.$.commentCount': commentCount }},
        callback
      );
    }
  };
})();

