var env = require('../../conf/config').env;

exports.index = function(req, res){
  res.render('index', {
    title: env.SITENAME,
    siteName: env.SITENAME
  });
};

exports.questionForm = function(req, res){
  res.render('question-form', {
    title: env.SITENAME + ' :: ' + '질문하기',
    siteName: env.SITENAME
  });
};

exports.questionView = function(req, res){
  res.render('question', {
    title: env.SITENAME + ' :: ' + '질문제목',
    siteName: env.SITENAME
  });
};