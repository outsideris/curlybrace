// # 사용자 관련 라우팅
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";

// Module dependencies.
var env = require('../../src/conf/config').env
  , dbService = require('../models/dbService')
  , users = require('../models/users');

// 디비설정 초기화
var db = dbService.init();
db.on('connected', function(err, db) {
  users.init(db);
});

// 소셜 로그인 페이지
exports.loginForm = function(req, res) {
  res.render('loginForm', {
    title: env.SITENAME,
    siteName: env.SITENAME,
    user: req.user
  });
};
