var Mongolian = require('mongolian')
  , CONST = require('../conf/constant');

var dbManager = module.exports = {
    db: null
  , users: null
  , init: function(opt) {
      var config = {
          host: opt.host || CONST.MONGODB_HOST
        , port: opt.port || CONST.MONGODB_PORT
        , dbName: opt.dbName || CONST.MONGODB_DB
        , users: opt.users || CONST.MONGODB_COLLECTION_USERS
      }
      this.db = new Mongolian(config.host + ':' + config.port, {
        log: {
            debug: function(message){ console.log(message) }
          , info:  function(message){ console.log(message) }
          , warn:  function(message){ console.log(message) }
          , error: function(message){ console.log(message) }
        }
      }).db(config.dbName);
      this.users = this.db.collection(config.users);
      return this;
    }
};