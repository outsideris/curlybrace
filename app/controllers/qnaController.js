"use strict";

var env = require('../../conf/config').env,
    dbService = require('../models/dbService'),
    questions = require('../models/qna').questions;

var db = dbService.init();
db.on('connected', function(err, db) {
  questions.init(db);
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

exports.questionView = function(req, res){
  res.render('question', {
    title: env.SITENAME + ' :: ' + '질문제목',
    siteName: env.SITENAME,
    user: req.user
  });
};

exports.registQuestion = function(req, res) {
  questions.insert(req.body, function(err, insertedQuestion) {
    if (err) {}

    res.redirect('/question/1');
  });
};