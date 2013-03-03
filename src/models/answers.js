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
    logger.debug('answers.isInited');
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
      // * 사용자 정보가 존재해야 한다.
      // * questionId는 숫자타입이어야 한다
      if (!user) { callback(new Error('user must be exist.')); return; }
      questionId = parseInt(questionId, 10);
      if (isNaN(questionId)) {
        callback(new Error('questionId must be number or convertable to number'));
        return;
      }

      // 답변에 필요한 필드 생성
      answer.id = helpers.generateUUID();
      answer.voteUp = 0;
      answer.voteDown = 0;
      // 사용자 정보 복사
      answer.author = {};
      answer.author.id = user._id;
      answer.author.nickname = user.nickname;
      answer.author.profileImage = user.profileImage;
      answer.author.profileImage = user.authInfo[user.defaultProvider].profileImage;

      questions.update(
        {_id: questionId},
        {$push: {answers: answer}},
        callback
      );
    }
  };
})();

