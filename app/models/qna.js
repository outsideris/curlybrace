"use strict";

var helpers = require('./helpers')
  , env = require('../../conf/config').env
  , tags = require('./tags')
  , counters = require('./counters');

module.exports = {
  questions: (function() {
    var questions = null;

    var isInited = function(callback) {
      if (questions) {
        return true;
      } else {
        callback(new Error('questions collection should not be null.'));
        return false;
      }
    };

    return {
      init: function(db) {
        questions = db.questions;
      },
      insert: function(question, callback) {
        if (!isInited(callback)) { return false; }
        if (helpers.isEmpty(question) || helpers.isEmpty(question.title) ||
            helpers.isEmpty(question.contents) || helpers.isEmpty(question.tags)) {
              callback(new Error('question is something wrong!'));
              return false;
        }
        question.tags = question.tags.split(',');
        tags.isAllExistInTags(question.tags, function(err, isExist) {
          if (err) { callback(new Error(err)); }

          if (isExist) {
            counters.getNextSequence(env.MONGODB_COLLECTION_QUESTIONS, function(err, seq) {
              if (err) { return callback(err); }
              question._id = seq;
              questions.insert(question, callback);
            });
          } else {
            callback(new Error('tags is something wrong!'));
          }
        });

      }
    };
  })(),
  answers: null
};

