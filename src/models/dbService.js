// # 디비를 관리하는 서비스
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";

// Module dependencies.
var mongo = require('mongodb')
  , Db = mongo.Db
  , Server = mongo.Server
  , env = require('../../src/conf/config').env
  , logger = require('../../src/conf/config').logger
  , EventEmitter = require('events').EventEmitter;

module.exports = {
  db: null
  , event: new EventEmitter()
  // 사용하는 컬렉션
  , users: null
  , tags: null
  , questions: null
  , counters: null
  // 전체 컬렉션 인스턴스 초기화
  , init: function() {
    logger.debug('dbService.init');
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
          self.questions = db.collection(env.MONGODB_COLLECTION_QUESTIONS);
          self.counters = db.collection(env.MONGODB_COLLECTION_COUNTERS);
        }
        self.event.emit('connected', err, self);
      });
    }

    return this.event;
  },
  // 테스트 등에서 컬렉션을 주입하기 위한 setter
  setTags: function(collectionName) {
    logger.debug('dbService.setTags', {collectionName: collectionName});
    this.tags = this.db.collection(collectionName);
  },
  setUsers: function(collectionName) {
    logger.debug('dbService.setUsers', {collectionName: collectionName});
    this.users = this.db.collection(collectionName);
  },
  setQuestions: function(collectionName) {
    logger.debug('dbService.setQuestions', {collectionName: collectionName});
    this.questions = this.db.collection(collectionName);
  },
  setCounters: function(collectionName) {
    logger.debug('dbService.setCounters', {collectionName: collectionName});
    this.counters = this.db.collection(collectionName);
  }
};
