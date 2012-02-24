var Mongolian = require('mongolian')
  , CONST = require('../conf/constant');

var dbManager = module.exports = {
    db: null
  , users: null
  , init: function() {
      this.db = new Mongolian(CONST.MONGODB_HOST + ':' + CONST.MONGODB_PORT, {
        log: {
          debug: function(message){ console.log(message) }
          , info:  function(message){ console.log(message) }
          , warn:  function(message){ console.log(message) }
          , error: function(message){ console.log(message) }
        }
      }).db(CONST.MONGODB_DB);
      this.users = this.db.collection(CONST.MONGODB_COLLECTION_USERS);
      return this;
    }
  , setUsers: function(collectionName) {
      this.users = this.db.collection(collectionName);
    }
  , getUsers: function() {
    return this.users;
  }
}.init();