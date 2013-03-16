// # 태그관련 모델
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";
// Module dependencies.
var logger = require('../../src/conf/config').logger;

module.exports = (function() {
  var tags = null;
  // 컬렉션 할당 여부
  var isInited = function(callback) {
    logger.debug('tags.isInited', {collectionName: tags.collectionName});
    if (tags) {
      return true;
    } else {
      callback(new Error('tags collection should not be null.'));
      return false;
    }
  };

  return {
    // 컬렉션 할당
    init: function(db) {
      logger.debug('tags.init');
      tags = db.tags;
    },
    // 주어진 검색어로 시작하는 태그를 조회한다.
    findTagsStartWith: function(tag, callback) {
      logger.debug('tags.findTagsStartWith', {tag: tag});
      //TODO: 별칭도 검사하기
      if (!isInited(callback)) { return false; }

      var regex = new RegExp(tag + "*");
      tags.find({name:regex}, {_id:0}).toArray(callback);
    },
    // 주어진 태그와 일치하는 태그를 조회한다.
    findOne: function(tag, callback) {
      logger.debug('tags.findOne', {tag: tag});
      if (!isInited(callback)) { return false; }

      //TODO: 별칭도 검사하기
      tags.findOne({name:tag}, callback);
    },
    // 전체 태그를 조회한다.
    getAll: function(callback) {
      logger.debug('tags.getAll');
      if (!isInited(callback)) { return false; }

      tags.find().toArray(callback);
    },
    // 전달한 태그 리스트가 모두 전체 태그에 포함되는지 검사한다.
    isAllExistInTags: function(tagList, callback) {
      logger.debug('tags.isAllExistInTags', {tagList: tagList});
      if (!isInited(callback)) { return false; }

      this.getAll(function(err, allTags) {
        if (err) { logger.error('Error Occured during querying MongoDB', {error: err.stack}); }

        var isExist = tagList.every(function(elem) {
          return allTags.some(function(el) {
            return (elem === el.name);
          });
        });
        callback(err, isExist);
      });
    }
  };
})();
