var CONST = require('../conf/constant');

var tagService = module.exports = {
  tags: null,
  init: function(db) {
    this.tags = db.tags;
  },
  isInited: function(callback) {
    if (this.tags) {
      return true;
    } else {
      callback(new Error('tags collection should not be null.'));
      return false;
    }
  },
  findTagsStartWith: function(tag, callback) {
    if (!this.isInited(callback)) { return false; }

    var regex = new RegExp(tag + "*");
    this.tags.find({name:regex}, {_id:0}).toArray(callback);
  }
};
