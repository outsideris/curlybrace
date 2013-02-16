"use strict";

var logger = require('../../conf/config').logger;

module.exports = (function() {
  var tags = null;
  var isInited = function(callback) {
    if (tags) {
      return true;
    } else {
      callback(new Error('tags collection should not be null.'));
      return false;
    }
  };

  return {
    init: function(db) {
      tags = db.tags;
    },
    findTagsStartWith: function(tag, callback) {
      // TO-DO: 별칭체크하기
      if (!isInited(callback)) { return false; }

      var regex = new RegExp(tag + "*");
      tags.find({name:regex}, {_id:0}).toArray(callback);
    },
    findOne: function(tag, callback) {
      if (!isInited(callback)) { return false; }

      tags.findOne({name:tag}, callback);
    },
    getAll: function(callback) {
      if (!isInited(callback)) { return false; }

      tags.find().toArray(callback);
    },
    isAllExistInTags: function(tagList, callback) {
      if (!isInited(callback)) { return false; }

      this.getAll(function(err, allTags) {
        if (err) { logger.error('Error Occured during querying MongoDB', {error: err}); }

        var isExist = tagList.every(function(elem) {
          return allTags.some(function(el) {
            // TO-DO: 별칭체크하기
            return (elem === el.name);
          });
        });
        callback(err, isExist);
      });
    }
  };
})();
