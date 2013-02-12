"use strict";

var logger = require('../../conf/config').logger;

module.exports = (function() {
  var counters = null;
  return {
    init: function(db) {
      counters = db.counters;
    },
    isInited: function(callback) {
      if (counters) {
        return true;
      } else {
        callback(new Error('counters collection should not be null.'));
        return false;
      }
    },
    insert: function(name, callback) {
      counters.insert({ _id: name, seq: 1 }, callback);
    },
    // name의 다음 시퀀스 번호를 반환한다.
    // name의 시퀀스가 존재하지 않으면 새로 생성해서 반환한다.
    getNextSequence: function(name, callback) {
      var _self = this;
      counters.findAndModify(
        { _id: name },
        [['_id', 1]],
        { $inc: { seq: 1 } },
        { new: true },
        function(err, counter) {
          if (err) { callback(new Error('Error Occured during querying counter')); }

          if (counter) {
            callback(err, counter.seq);
          } else {
           _self.insert(name, function(err, counter) {
             if (err) { callback(new Error('Error Occured during creating Counter')); }
             callback(err, counter[0].seq);
           });
          }
        }
      );
    }
  };
})();
