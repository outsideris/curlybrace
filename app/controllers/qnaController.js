"use strict";

var env = require('../../conf/config').env,
    logger = require('../../conf/config').logger,
    dbService = require('../models/dbService'),
    questions = require('../models/qna').questions,
    counters = require('../models/counters');

var db = dbService.init();
db.on('connected', function(err, db) {
  questions.init(db);
  counters.init(db);
});

exports.index = function(req, res){
  res.render('index', {
    title: env.SITENAME,
    siteName: env.SITENAME,
    user: req.user
  });
};

exports.questionForm = function(req, res){
  res.render('question-form', {
    title: env.SITENAME + ' :: ' + '질문하기',
    siteName: env.SITENAME,
    user: req.user
  });
};

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

exports.registQuestion = function(req, res) {
  questions.insert(req.body, function(err, insertedQuestion) {
    if (err) { logger.error('Error Occured during querying MongoDB', {error: err}); return false;}

    res.redirect('/question/' + insertedQuestion[0]._id);
  });
};