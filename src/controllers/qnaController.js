// # 질문/답변 관련 라우팅
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";

// Module dependencies.
var env = require('../../src/conf/config').env,
    logger = require('../../src/conf/config').logger,
    dbService = require('../models/dbService'),
    questions = require('../models/questions'),
    answers = require('../models/answers'),
    counters = require('../models/counters'),
    comments = require('../models/comments');

// 디비설정 초기화
var db = dbService.init();
db.on('connected', function(err, db) {
  questions.init(db);
  answers.init(db);
  counters.init(db);
  comments.init(db);
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
exports.questionForm = function(req, res) {
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
      url: env.HOST + (env.PORT ? ':' + env.PORT : ''),
      user: req.user,
      question: question
    });
  });
};

// 질문 등록 처리
exports.registQuestion = function(req, res) {
  questions.insert(req.body, req.user, function(err, insertedQuestion) {
    if (err) { logger.error('Error Occured during querying MongoDB', {error: err.stack}); return false;}

    res.redirect('/question/' + insertedQuestion[0]._id);
  });
};

// 답변 등록 처리
exports.registAnswer = function(req, res) {
  answers.insert(req.params.id, req.body, req.user, function(err) {
    if (err) { logger.error('Error Occured during querying MongoDB', {error: err.stack}); return false;}

    res.redirect('/question/' + req.params.id);
  });
};

// 댓글 등록 처리
exports.registComment = function(req, res) {
  var idObj = {
    questionId: req.params.id,
    answerId: req.params.aid
  };

  comments.insert(idObj, req.body, req.user, function(err) {
    if (err) { logger.error('Error Occured during querying MongoDB', {error: err.stack}); return false;}

    res.send({
      success: true
    });
    //res.redirect('/question/' + req.params.id);
  });
};
