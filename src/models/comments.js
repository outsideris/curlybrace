// # 댓글 관련 모델
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
  , questions = require('./questions')
  , answers = require('./answers')
  , markdown = require('markdown').markdown
  , logger = require('../../src/conf/config').logger;

module.exports = (function() {
  var comments = null;

  // 컬렉션 인스턴스 할당 여부
  var isInited = function(callback) {
    logger.debug('comments.isInited', {collectionName: comments.collectionName});
    if (comments) {
      return true;
    } else {
      callback(new Error('comments collection should not be null.'));
      return false;
    }
  };

  var updateCommentCount = function(idObj, commentCount, callback) {
    logger.debug('comments.updateCommentCount', {idObj: idObj, commentCount: commentCount});
    if (idObj.answerId) {
      answers.increaseCommentCount(idObj.questionId, idObj.answerId, commentCount, callback);
    } else {
      questions.increaseCommentCount(idObj.questionId, commentCount, callback);
    }
  };

  return {
    // 컬렉션 인스턴스 할당
    init: function(db) {
      logger.debug('comments.init');
      comments = db.comments;
    },
    // 질문에 답변을 추가한다.
    // * idObj -> { questionId: questionId, answerId: answerId }
    insert: function(idObj, comment, user, callback) {
      logger.debug('comments.insert', {idObj: idObj, comment: comment, user: user});
      if (!isInited(callback)) { return false; }

      // validation
      // * 사용자 정보가 존재해야 한다.
      // * questionId는 숫자타입이어야 한다
      if (!user) { callback(new Error('user must be exist.')); return; }
      idObj.questionId = parseInt(idObj.questionId, 10);
      if (isNaN(idObj.questionId)) {
        callback(new Error('questionId must be number or convertable to number'));
        return;
      }
      if (!idObj.answerId) { delete idObj.answerId; }

      // 답변에 필요한 필드 생성
      comment.id = helpers.generateUUID();
      comment.regDate = new Date();
      // 사용자 정보 복사
      comment.author = {};
      comment.author.id = user._id;
      comment.author.nickname = user.nickname;
      comment.author.profileImage = user.authInfo[user.defaultProvider].profileImage;

      comments.findOne({_id: idObj}, function(err, foundComment) {
        if (err) { callback(new Error(err)); return false;}

        if (foundComment) {
          comments.update(
            {_id: idObj},
            {$push: {comments: comment}},
            function(err) {
              if (err) { callback(new Error(err)); return false;}
              updateCommentCount(idObj, foundComment.comments.length + 1, callback);
            }
          );
        } else {
          comments.insert({
            _id: idObj,
            comments: [comment]
          }, function(err) {
            if (err) { callback(new Error(err)); return false;}

            updateCommentCount(idObj, 1, callback);
          });
        }
      });
    },
    // 아이디로 댓글 리스트를 조회한다.
    // * `idObj` -> `{ questionId: questionId, answerId: answerId }`
    // * questionId는 필수값이다.
    // * answerId가 없으면 질문의 댓글을 조회하고 answerId가 있으면 답변의 댓글을 조회한다
    findById: function(idObj, callback) {
      logger.debug('comments.findById', {idObj: idObj});
      if (!isInited(callback)) { return false; }

      // validation
      // * questionId는 필수값이다
      // * questionId는 숫자값이거나 변환가능해야 한다
      if (!idObj.questionId) { callback(new Error('questionId must be exist.')); return; }
      idObj.questionId = parseInt(idObj.questionId, 10);
      if (isNaN(idObj.questionId)) {
        callback(new Error('questionId must be number or convertable to number'));
        return;
      }
      if (!idObj.answerId) { delete idObj.answerId; }

      comments.findOne({_id: idObj}, function(err, foundComment) {
        if (err) { callback(new Error(err)); return false;}

        var resultComments = [];
        if (foundComment) {
          foundComment.comments.forEach(function(comment) {
            comment.regDateFromNow = helpers.getTimeFromNow(comment.regDate);
            comment.regDateformatted = helpers.formatDate(comment.regDate);
            resultComments.push(comment);
          });
        }

        callback(err, resultComments);
      });
    }
  };
})();

