var Mongolian = require('mongolian')
  , env = require('../../conf/config').env
  , logger = require('../../conf/config').logger;

module.exports = {
  db: null
  , users: null
  , tags: null
  , init: function(opt) {
    opt = opt || {};
    var config = {
      host: opt.host || env.MONGODB_HOST
      , port: opt.port || env.MONGODB_PORT
      , dbName: opt.dbName || env.MONGODB_DB
      , users: opt.users || env.MONGODB_COLLECTION_USERS
      , tags: opt.tags || env.MONGODB_COLLECTION_TAGS
    };

    if (!this.db) {
      this.db = new Mongolian(config.host + ':' + config.port, {
        log: {
          debug: function(message){ logger.info(message) }
          , info:  function(message){ logger.info(message) }
          , warn:  function(message){ logger.info(message) }
          , error: function(message){ logger.infog(message) }
        }
      }).db(config.dbName);
    }

    this.users = this.db.collection(config.users);
    this.tags = this.db.collection(config.tags);

    return this;
  }
};
