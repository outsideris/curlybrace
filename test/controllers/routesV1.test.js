/*global describe:true, it:true, before:true, after:true */
"use strict";

var http = require('http')
  , env = require('../../conf/config').env
  , dbService = require('../../app/models/dbService');

describe('API V1', function() {
  var server;
  var db;
  describe('태그명의 일부로 조회한다', function() {
    before(function(done) {
      db = dbService.init();
      db.once('connected', function(err, pdb) {
        db = pdb;
        done();
      });
      server = require('../../app');
      server.httpd.listen(env.PORT);
    });
    after(function() {
      db.db.close();
      db.db = null;
    });

    it('application/json으로 요청할 경우 JSON을 리턴한다', function(done) {
      http.get({
        path: '/v1/tags?q=jav&how=startWith'
        , port: env.PORT
        , 'Accept': 'application/json'
      }, function(res) {
        res.should.be.json;
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          JSON.parse(chunk).success.should.be.true;
        });
        done();
      });
    });
  });
});

