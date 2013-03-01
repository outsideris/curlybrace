// # URL 라우팅
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";
// Module dependencies.
var qna = require('../controllers/qnaController')
  , users = require('../controllers/usersController')
  , apiV1 = require('../controllers/v1Controller')
  , help = require('../controllers/helpController');

module.exports = function(app, passport) {
// 인증된 사용자만 통과시키는 미들웨어
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
// 미인증된 사용자만 통과시키는 미들웨어
function ensureUnauthenticated(req, res, next) {
  if (req.isUnauthenticated()) { return next(); }
  res.redirect('/');
}

// 질문 관련 라우팅
app.get('/', qna.index);

app.get('/question/form', ensureAuthenticated, qna.questionForm);

app.post('/question', ensureAuthenticated, qna.registQuestion);

app.get('/question/:id', qna.questionView);

// 답변 관련 라우팅
app.post('/question/:id/answer', qna.registAnswer);

// 인증관련 라우팅
app.get('/login', ensureUnauthenticated, users.loginForm);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// SNS 인증관련 페이지
app.get('/auth/twitter', ensureUnauthenticated, passport.authenticate('twitter'));

app.get('/auth/facebook', ensureUnauthenticated, passport.authenticate('facebook'));

app.get('/auth/google', ensureUnauthenticated,
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile'
      , 'https://www.googleapis.com/auth/userinfo.email'
    ]
  }
));

app.get('/auth/github', ensureUnauthenticated, passport.authenticate('github'));

app.get('/auth/me2day', ensureUnauthenticated, passport.authenticate('me2day'));

// SNS 인증 콜백 페이지
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/auth/me2day/callback',
  passport.authenticate('me2day', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

// 도움말관련 라우팅
app.get('/help/markdown', help.markdown);

// API v1 관련 라우팅
app.get('/v1/tags', apiV1.findTags);
};


