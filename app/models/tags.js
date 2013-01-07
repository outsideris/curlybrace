"use strict";

module.exports = (function() {
  var tags = null;
  return {
    init: function(db) {
      tags = db.tags;
    },
    isInited: function(callback) {
      if (tags) {
        return true;
      } else {
        callback(new Error('tags collection should not be null.'));
        return false;
      }
    },
    findTagsStartWith: function(tag, callback) {
      if (!this.isInited(callback)) { return false; }

      var regex = new RegExp(tag + "*");
      tags.find({name:regex}, {_id:0}).toArray(callback);
    }
  };
})();
