var CONST = require('../conf/constant');

exports.index = function(req, res){
  res.render('index', {
    title: CONST.SITENAME,
    siteName: CONST.SITENAME
  });
};

exports.questionForm = function(req, res){
  res.render('question-form', {
    title: CONST.SITENAME + ' :: ' + '질문하기',
    siteName: CONST.SITENAME
  });
};

exports.questionView = function(req, res){
  res.render('question', {
    title: CONST.SITENAME + ' :: ' + '질문제목',
    siteName: CONST.SITENAME
  });
};