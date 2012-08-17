module.exports = {
  coll: null,
  init: function(db) {
    this.coll = db.tags;
  },
  isInited: function(callback) {
    if (this.coll) {
      return true;
    } else {
      callback(new Error('tags collection should not be null.'));
      return false;
    }
  },
  findTagsStartWith: function(tag, callback) {
    if (!this.isInited(callback)) { return false; }

    var regex = new RegExp(tag + "*");
    this.coll.find({name:regex}, {_id:0}).toArray(callback);
  }
};
