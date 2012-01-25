var should = require('should')
  , http = require('http')
  , server = require('../app');

describe('라우팅', function() {
  describe('정적페이지 ', function() {
    it('인덱스 페이지는 200 OK 이어야 한다', function(done) {
      http.get({path: '/', port: 3000}, function(res) {
        res.should.have.status(200);
        done();
      });
    });

    it('질문하기 페이지는 200 OK 이어야 한다', function(done) {
      http.get({path: '/question/form', port: 3000}, function(res) {
        res.should.have.status(200);
        done();
      });
    });

    it('회원가입 페이지는 200 OK 이어야 한다', function(done) {
      http.get({path: '/join', port: 3000}, function(res) {
        res.should.have.status(200);
        done();
      });
    });
  });

  describe('OAuth 인증', function() {
    it('트위터 인증 요청페이지는 트위터로 리다이렉트 된다.', function(done) {
      http.get({path: '/auth/twitter', port: 3000}, function(res) {
        res.should.have.status(303);
        res.headers.location.should.match(/^https:\/\/api.twitter.com\/oauth\/authenticate/);
        done();
      });
    });
    it('페이스북 인증 요청페이지는 페이스북으로 리다이렉트 된다.', function(done) {
      http.get({path: '/auth/facebook', port: 3000}, function(res) {
        res.should.have.status(303);
        res.headers.location.should.match(/^https:\/\/www.facebook.com\/dialog\/oauth/);
        done();
      });
    });
    it('구글 인증 요청페이지는 구글로 리다이렉트 된다.', function(done) {
      http.get({path: '/auth/google', port: 3000}, function(res) {
        res.should.have.status(303);
        res.headers.location.should.match(/^https:\/\/accounts.google.com\/o\/oauth2\/auth/);
        done();
      });
    });
    it('미투데이 인증 요청페이지는 미투데이로 리다이렉트 된다.', function(done) {
      http.get({path: '/auth/me2day', port: 3000}, function(res) {
        //res.should.have.status(303);
        //res.headers.location.should.match(/^https:\/\/accounts.google.com\/o\/oauth2\/auth/);
        done();
      });
    });
  });
});

