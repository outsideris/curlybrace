// # 질문 관련 모델
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
  , markdown = require('markdown').markdown;

module.exports = (function() {
  var questions = null;

  // 컬렉션 인스턴스 할당 여부
  var isInited = function(callback) {
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
      questions = db.questions;
    },
    // 질문을 컬렉션에 추가한다.
    insert: function(question, callback) {
      if (!isInited(callback)) { return false; }
      // validation
      // * 제목/내용/태그가 모두 있어야 한다.
      if (helpers.isEmpty(question) || helpers.isEmpty(question.title) ||
          helpers.isEmpty(question.contents) || helpers.isEmpty(question.tags)) {
            callback(new Error('question is something wrong!'));
            return false;
      }
      question.tags = question.tags.split(',');
      tags.isAllExistInTags(question.tags, function(err, isExist) {
        if (err) { callback(new Error(err)); return false;}

        if (isExist) {
          counters.getNextSequence(env.MONGODB_COLLECTION_QUESTIONS, function(err, seq) {
            if (err) { return callback(err); }

            question._id = seq;
            question.voteUp = 0;
            question.voteDown = 0;
            question.viewCount = 0;

            questions.insert(question, callback);
          });
        } else {
          callback(new Error('tags is something wrong!'));
        }
      });
    },
    // ID로 해당 질문을 조회한다.
    // 조회한 뒤 내용을 HTML로 렌더링한다.
    findOneById: function(id, callback) {
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
        // render markdown to HTML
        if (!question) { callback(new Error('Question is not found.')); return;}
        question.renderedContents = markdown.toHTML(question.contents);
        callback(err, question);
      });
    }
  };
})();

