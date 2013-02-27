// # API v1 라우팅 테스트
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
/*global describe:true, it:true, before:true, after:true */
"use strict";

var http = require('http')
  , env = require('../../src/conf/config').env
  , dbService = require('../../src/models/dbService');

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

