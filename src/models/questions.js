// # 질문 관련 모델
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";
// Module dependencies.
var helpers = require('./helpers')
  , env = require('../../src/conf/config').env
  , logger = require('../../src/conf/config').logger
  , tags = require('./tags')
  , counters = require('./counters')
  , markdown = require('markdown').markdown;

module.exports = (function() {
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
      logger.debug('questions.init');
      questions = db.questions;
    },
    // 질문을 컬렉션에 추가한다.
    insert: function(question, user, callback) {
      logger.debug('questions.insert', {question: question, user: user});
      if (!isInited(callback)) { return false; }
      // validation
      // * 제목/내용/태그가 모두 있어야 한다.
      // * 태그는 디비의 태그리스트에 존재하는 태그여야 한다.
      // * 사용자 정보가 존재해야 한다.
      if (!user) { callback(new Error('user must be exist.')); return; }
      if (helpers.isEmpty(question) || helpers.isEmpty(question.title) ||
          helpers.isEmpty(question.contents) || helpers.isEmpty(question.tags)) {
            callback(new Error('question is something wrong!'));
            return false;
      }
      question.tags = question.tags.split(',');
      tags.isAllExistInTags(question.tags, function(err, isExist) {
        if (err) { callback(new Error(err)); return false;}

        if (isExist) {
          counters.getNextSequence(questions.collectionName, function(err, seq) {
            if (err) { return callback(err); }

            question._id = seq;
            question.regDate = new Date();
            question.voteUp = 0;
            question.voteDown = 0;
            question.viewCount = 0;
            question.author = {};
            question.author.id = user._id;
            question.author.nickname = user.nickname;
            question.author.profileImage = user.authInfo[user.defaultProvider].profileImage;

            questions.insert(question, callback);
          });
        } else {
          callback(new Error('tags must exist in tag collection'));
        }
      });
    },
    // ID로 해당 질문을 조회한다.
    // 조회한 뒤 내용을 HTML로 렌더링한다.
    findOneById: function(id, callback) {
      logger.debug('questions.findOneById', {id: id});
      if (!isInited(callback)) { return false; }

      // validation
      // * id는 숫자타입이어야 한다
      id = parseInt(id, 10);
      if (isNaN(id)) {
        callback(new Error('id must be number or convertable to number'));
        return;
      }

      var criteria = {'_id': id};
      questions.findOne(criteria, function(err, question) {
        if (err) { callback(new Error(err)); return false;}
        if (!question) { callback(new Error('Question is not found.')); return;}

        // render markdown to HTML
        question.renderedContents = markdown.toHTML(question.contents);
        // format date
        question.regDateFromNow = helpers.getTimeFromNow(question.regDate);
        question.regDateformatted = helpers.formatDate(question.regDate);
        if (question.answers) {
          question.answers.forEach(function(answer) {
            answer.regDateFromNow = helpers.getTimeFromNow(answer.regDate);
            answer.regDateformatted = helpers.formatDate(answer.regDate);
          });
        }

        callback(err, question);
      });
    },
    increaseComment: function(id, commentCount, callback) {
      logger.debug('questions.increaseComment', {id: id, commentCount: commentCount});
      if (!isInited(callback)) { return false; }

      // validation
      // * `id`는 숫자타입이어야 한다
      // * `commentCount`는 숫자타입이어야 한다.
      id = parseInt(id, 10);
      if (isNaN(id)) {
        callback(new Error('id must be number or convertable to number'));
        return;
      }
      commentCount = parseInt(commentCount, 10);
      if (isNaN(commentCount)) {
        callback(new Error('commentCount must be number or convertable to number'));
        return;
      }

      questions.update(
        {'_id': id},
        {$set: {commentCount: commentCount }},
        callback
      );
    }
  };
})();

