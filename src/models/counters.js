// # 카운터 관리 모델
// MongoDB에서 `_id`를 순차적 증가값으로 관리할 수 있도록
// 컬렉션 이름별 순차장가값을 관리하는 컬렉션
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";

var logger = require('../../src/conf/config').logger;

module.exports = (function() {
  var counters = null;
  // 컬렉션 인스턴스 할당 여부
  var isInited = function(callback) {
    logger.debug('counters.inInited');
    if (counters) {
      return true;
    } else {
      callback(new Error('counters collection should not be null.'));
      return false;
    }
  };

  return {
    // 컬렉션 인스턴스 할당
    init: function(db) {
      logger.debug('counters.init');
      counters = db.counters;
    },
    // 컬렉션 이름으로 새로운 카운터를 추가한다
    // 컬렉션명을 키로 사용한다
    insert: function(name, callback) {
      logger.debug('counters.name', {name: name});
      if (!isInited(callback)) { return false; }

      counters.insert({ _id: name, seq: 1 }, callback);
    },
    // 컬렉션이름으로 다음 카운터 번호를 반환한다.
    // 해당 컬렉션에 대한 카운터가 존재하지 않으면 새로 생성해서 반환한다.
    getNextSequence: function(name, callback) {
      logger.debug('counters.getNextSequence', {name: name});
      if (!isInited(callback)) { return false; }

      var _self = this;
      counters.findAndModify(
        { _id: name },
        [['_id', 1]],
        { $inc: { seq: 1 } },
        { new: true },
        function(err, counter) {
          if (err) { callback(new Error('Error Occured during querying counter')); return;}

          if (counter) {
            callback(err, counter.seq);
          } else {
           _self.insert(name, function(err, counter) {
             if (err) { callback(new Error('Error Occured during creating Counter')); return;}
             callback(err, counter[0].seq);
           });
          }
        }
      );
    }
  };
})();
