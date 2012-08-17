var qna = require('../app/controllers/qna')
  , member = require('../app/controllers/member')
  , api_v1 = require('../app/controllers/v1')
  , help = require('../app/controllers/help');

module.exports = function(app) {
// 질문&답변 관련
app.get('/', qna.index);

app.get('/question/form', qna.questionForm);

app.get('/question/:id', qna.questionView);

// 회원관련
app.get('/login', member.loginForm);

app.post('/join', member.processJoin);

app.get('/auth/me2day', member.requestMe2dayAuth);

// 도움말
app.get('/help/markdown', help.markdown);

// API V1
app.get('/v1/tags', api_v1.findTags);

};
