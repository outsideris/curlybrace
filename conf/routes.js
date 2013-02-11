"use strict";

var qna = require('../app/controllers/qnaController')
  , users = require('../app/controllers/usersController')
  , apiV1 = require('../app/controllers/v1Controller')
  , help = require('../app/controllers/helpController');

module.exports = function(app, passport) {
// confirm authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

function ensureUnauthenticated(req, res, next) {
  if (req.isUnauthenticated()) { return next(); }
  res.redirect('/');
}

// 질문&답변 관련
app.get('/', qna.index);

app.get('/question/form', ensureAuthenticated, qna.questionForm);

app.post('/question', ensureAuthenticated, qna.registQuestion);

app.get('/question/:id', qna.questionView);

// 회원관련
app.get('/login', ensureUnauthenticated, users.loginForm);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

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

// 도움말
app.get('/help/markdown', help.markdown);

// API V1
app.get('/v1/tags', apiV1.findTags);
};


