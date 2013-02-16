// # API v1 관련 라우팅
"use strict";

// Module dependencies.
var dbService = require('../models/dbService')
  , tagService = require('../models/tags')
  , logger = require('../../conf/config').logger;

// 디비설정 초기화
var db = dbService.init();
db.on('connected', function(err, db) {
  tagService.init(db);
});

// 검색어(`q`)로 시작하는 태그를 검색한다.
exports.findTags = function(req, res){
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
