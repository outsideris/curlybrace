// # URL 라우팅
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";
// Module dependencies.
var qna = require('../controllers/qnaController')
  , users = require('../controllers/usersController')
  , comments = require('../controllers/commentsController')
  , tags = require('../controllers/tagsController')
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

app.get('/questions/add', ensureAuthenticated, qna.questionForm);

//app.get('/questions', qna.);
app.post('/questions', ensureAuthenticated, qna.registQuestion);

app.get('/questions/:id', qna.questionView);
//app.put('/questions/:id', qna.);
//app.get('/questions/:id/edit', qna.);

// 답변 관련 라우팅
//app.get('/questions/:id/answers', qna.);
app.post('/questions/:id/answers', qna.registAnswer);

//app.get('/questions/:id/answers/:id/edit', qna.);
//app.put('/questions/:id/answers/:id', qna.);

// 댓글 관련 라우팅
app.get('/questions/:id/comments', comments.findComments);
app.post('/questions/:id/comments', qna.registComment);

app.get('/questions/:id/answers/:aid/comments', comments.findComments);
app.post('/questions/:id/answers/:aid/comments', qna.registComment);

// 태그 관련 라우팅
app.get('/tags', tags.findTags);

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
};


