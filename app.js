
/**
 * Module dependencies.
 */

var express = require('express')
  , everyauth = require('./libs/everyauth')
  , clog = require('clog');

global.clog = clog;
// configure clog
clog.configure({
  'log level': {
    'log': true,
    'info': true,
    'warn': true,
    'error': true,
    'debug': true
  }
});

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'htuayreve'}));
  app.use(everyauth.middleware());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
var routeQnA = require('./routes/qna')
  , routeMember = require('./routes/member');

// 질문&답변 관련
app.get('/', routeQnA.index);

app.get('/question/form', routeQnA.questionForm);

app.get('/question/:id', routeQnA.questionView);

// 회원관련
app.get('/join', routeMember.joinForm);

app.post('/join', routeMember.processJoin);

app.get('/auth/me2day', routeMember.requestMe2dayAuth);

// Binding Server
everyauth.helpExpress(app);
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
