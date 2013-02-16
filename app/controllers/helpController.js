// # 도움말 관련 라우팅
"use strict";

// Module dependencies.
var env = require('../../conf/config').env;

// 마크다운 사용법 가이드
exports.markdown = function(req, res) {
  res.render('help/markdown', {
    title: env.SITENAME,
    siteName: env.SITENAME,
    user: req.user
  });
};