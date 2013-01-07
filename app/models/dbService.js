"use strict";

var mongo = require('mongodb')
  , Db = mongo.Db
  , Server = mongo.Server
  , env = require('../../conf/config').env
  , logger = require('../../conf/config').logger
  , EventEmitter = require('events').EventEmitter;

module.exports = {
  db: null
  , event: new EventEmitter()
  , users: null
  , tags: null
  , init: function() {
    var self = this;

    if (!this.db) {
      var server = new Server(env.MONGODB_HOST, env.MONGODB_PORT, {'auto_reconnect': true});
      this.db = new Db(env.MONGODB_DB, server, {'native_parser':true, 'safe': true});

      this.db.open(function(err, db) {
        if(err) {
          logger.error('Error Occured during connecting MongoDB', {error: err});
        } else {
          logger.info('MongoDB is connected!');

          self.db = db;
          self.users = db.collection(env.MONGODB_COLLECTION_USERS);
          self.tags = db.collection(env.MONGODB_COLLECTION_TAGS);
        }
        self.event.emit('connected', err, self);
      });
    }

    return this.event;
  }, setTags: function(collectionName) {
    this.tags = this.db.collection(collectionName);
  }, setUsers: function(collectionName) {
    this.users = this.db.collection(collectionName);
  }
};
