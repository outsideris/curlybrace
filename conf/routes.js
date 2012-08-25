var qna = require('../app/controllers/qna')
  , users = require('../app/controllers/users')
  , api_v1 = require('../app/controllers/v1')
  , help = require('../app/controllers/help');

module.exports = function(app, passport) {
// 질문&답변 관련
app.get('/', qna.index);

app.get('/question/form', qna.questionForm);

app.get('/question/:id', qna.questionView);

// 회원관련
app.get('/login', users.loginForm);

app.post('/join', users.processJoin);

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile'
      , 'https://www.googleapis.com/auth/userinfo.email'
    ]
  }
));

app.get('/auth/github', passport.authenticate('github'));

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

// 도움말
app.get('/help/markdown', help.markdown);

// API V1
app.get('/v1/tags', api_v1.findTags);
};
