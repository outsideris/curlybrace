// # 질문/답변 관련 라우팅
"use strict";

// Module dependencies.
var env = require('../../src/conf/config').env,
    logger = require('../../src/conf/config').logger,
    dbService = require('../models/dbService'),
    questions = require('../models/questions'),
    counters = require('../models/counters');

// 디비설정 초기화
var db = dbService.init();
db.on('connected', function(err, db) {
  questions.init(db);
  counters.init(db);
});

// 인덱스 페이지
exports.index = function(req, res){
  res.render('index', {
    title: env.SITENAME,
    siteName: env.SITENAME,
    user: req.user
  });
};

// 질문등록 폼 페이지
exports.questionForm = function(req, res){
  res.render('question-form', {
    title: env.SITENAME + ' :: ' + '질문하기',
    siteName: env.SITENAME,
    user: req.user
  });
};

// id의 질문 내용 보기 페이지
exports.questionView = function(req, res) {
  questions.findOneById(req.params.id, function(err, question) {
    res.render('question', {
      title: question.title + ' :: ' + env.SITENAME,
      siteName: env.SITENAME,
      user: req.user,
      question: question
    });
  });
};

// 질문 등록 처리
exports.registQuestion = function(req, res) {
  questions.insert(req.body, function(err, insertedQuestion) {
    if (err) { logger.error('Error Occured during querying MongoDB', {error: err}); return false;}

    res.redirect('/question/' + insertedQuestion[0]._id);
  });
};
