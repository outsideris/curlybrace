// # API v1 관련 라우팅
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";

// Module dependencies.
var dbService = require('../models/dbService')
  , comments = require('../models/comments')
  , tagService = require('../models/tags')
  , logger = require('../../src/conf/config').logger;

// 디비설정 초기화
var db = dbService.init();
db.on('connected', function(err, db) {
  comments.init(db);
  tagService.init(db);
});

// 검색어(`q`)로 시작하는 태그를 검색한다.
module.exports.findTags = function(req, res) {
  if (req.query.how === 'startWith') {
    tagService.findTagsStartWith(req.query.q, function(err, tags) {
      if (req.accepts('application/json')) {
        if (err) {
          logger.error(err);
          res.send({
            success: false
            , results: []
          });
        } else {
          res.send({
            success: true
            , results: tags
          });
        }
      }
    });
  }
};

// 글에 달린 댓글을 조회한다
// * `id`와 `aid` 필요.
// * `aid`가 없으면 질문의 댓글
module.exports.findComments = function(req, res) {
  if (req.params.id) {
    comments.findById(
      {
        questionId: req.params.id,
        answerId: req.params.aid
      }, function(err, comments) {
        if (err) {
          logger.error(err);
          res.send({
            success: false,
            results: []
          });
        } else {
          res.send({
            success: true,
            results: comments
          });
        }
      });
  } else {
    //TODO: bad requests
  }
};
