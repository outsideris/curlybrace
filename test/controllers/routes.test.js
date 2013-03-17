// # 라우팅 테스트
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
/*global describe, it, before, after */
"use strict";

var http = require('http')
  , env = require('../../src/conf/config').env
  , dbService = require('../../src/models/dbService');

describe('routes >', function() {
  var server;
  var db;
  describe('정적페이지 >', function() {
    before(function(done) {
      db = dbService.init();
      db.once('connected', function(err, pdb) {
        db = pdb;
        done();
      });
      server = require('../../app');
    });
    after(function() {
      db.db.close();
      db.db = null;
      server.httpd.close();
    });
    it('인덱스 페이지는 200 OK 이어야 한다', function(done) {
      http.get({path: '/', port: env.PORT}, function(res) {
        res.should.have.status(200);
        done();
      });
    });

    // TODO: 인증했을때로 수정해야 함.
    it.skip('질문하기 페이지는 200 OK 이어야 한다', function(done) {
      http.get({path: '/questions/form', port: env.PORT}, function(res) {
        res.should.have.status(200);
        done();
      });
    });

    it('마크다운 도움말 페이지는 200 OK 이어야 한다', function(done) {
      http.get({path: '/help/markdown', port: env.PORT}, function(res) {
        console.log(res.statusCode);
        res.should.have.status(200);
        done();
      });
    });
  });

  describe('passport >', function() {
    before(function(done) {
      db = dbService.init();
      db.once('connected', function(err, pdb) {
        db = pdb;
        done();
      });
      // setting production mode for avoiding login mocking.
      process.env.NODE_ENV = 'production';
      server = require('../../app');
      server.httpd.listen(env.PORT);
    });
    after(function() {
      db.db.close();
      db.db = null;
      process.env.NODE_ENV = undefined;
    });

    //TODO: 로그인 Mock때문에 실패함. production으로 재실행할 수 있게 한 뒤에 다시 테스트해야 함.
    it.skip('로그인폼 페이지는 200 OK이어야 한다.', function(done) {
      http.get({path: '/login', port: env.PORT}, function(res) {
        res.should.have.status(200);
        done();
      });
    });
    it.skip('트위터 인증 요청페이지는 트위터로 리다이렉트 된다.', function(done) {
      http.get({path: '/auth/twitter', port: env.PORT}, function(res) {
        res.should.have.status(302);
        res.headers.location.should.match(/^https:\/\/api.twitter.com\/oauth\/authenticate/);
        done();
      });
    });
    it.skip('페이스북 인증 요청페이지는 페이스북으로 리다이렉트 된다.', function(done) {
      http.get({path: '/auth/facebook', port: env.PORT}, function(res) {
        res.should.have.status(302);
        res.headers.location.should.match(/^https:\/\/www.facebook.com\/dialog\/oauth/);
        done();
      });
    });
    it.skip('구글 인증 요청페이지는 구글로 리다이렉트 된다.', function(done) {
      http.get({path: '/auth/google', port: env.PORT}, function(res) {
        res.should.have.status(302);
        res.headers.location.should.match(/^https:\/\/accounts.google.com\/o\/oauth2\/auth/);
        done();
      });
    });
  });
});

