var should = require('should')
  , http = require('http')
  , env = require('../../conf/config').env
  , authToken = require('../../conf/config').authToken
  , dbService = require('../../app/models/dbService')
  , logger = require('../../conf/config').logger;

describe('라우팅', function() {
  var server;
  var db;
  before(function(done) {
    db = dbService.init();
    db.once('connected', function(err, pdb) {
      db = pdb;
      done();
    });
    server = require('../../app')
  });
  after(function() {
    db.db.close();
    db.db = null;
  });
  describe('정적페이지 ', function() {
    it('인덱스 페이지는 200 OK 이어야 한다', function(done) {
      http.get({path: '/', port: env.PORT}, function(res) {
        res.should.have.status(200);
        done();
      });
    });

    // TODO: 인증했을때로 수정해야 함.
    it.skip('질문하기 페이지는 200 OK 이어야 한다', function(done) {
      http.get({path: '/question/form', port: env.PORT}, function(res) {
        res.should.have.status(200);
        done();
      });
    });

    it('마크다운 도움말 페이지는 200 OK 이어야 한다', function(done) {
      http.get({path: '/help/markdown', port: env.PORT}, function(res) {
        res.should.have.status(200);
        done();
      });
    });
  });

  describe('OAuth 인증', function() {
    var server;

    before(function() {
      server = require('../../app');
    });
    it('로그인폼 페이지는 200 OK이어야 한다.', function(done) {
      http.get({path: '/login', port: env.PORT}, function(res) {
        res.should.have.status(200);
        done();
      });
    });
    it('트위터 인증 요청페이지는 트위터로 리다이렉트 된다.', function(done) {
      http.get({path: '/auth/twitter', port: env.PORT}, function(res) {
        res.should.have.status(302);
        res.headers.location.should.match(/^https:\/\/api.twitter.com\/oauth\/authenticate/);
        done();
      });
    });
    it('페이스북 인증 요청페이지는 페이스북으로 리다이렉트 된다.', function(done) {
      http.get({path: '/auth/facebook', port: env.PORT}, function(res) {
        res.should.have.status(302);
        res.headers.location.should.match(/^https:\/\/www.facebook.com\/dialog\/oauth/);
        done();
      });
    });
    it('구글 인증 요청페이지는 구글로 리다이렉트 된다.', function(done) {
      http.get({path: '/auth/google', port: env.PORT}, function(res) {
        res.should.have.status(302);
        res.headers.location.should.match(/^https:\/\/accounts.google.com\/o\/oauth2\/auth/);
        done();
      });
    });
  });
});

