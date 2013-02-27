// # 도움말 관련 라우팅
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";

// Module dependencies.
var env = require('../../src/conf/config').env;

// 마크다운 사용법 가이드
exports.markdown = function(req, res) {
  res.render('help/markdown', {
    title: env.SITENAME,
    siteName: env.SITENAME,
    user: req.user
  });
};
