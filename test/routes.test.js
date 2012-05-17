var should = require('should')
  , http = require('http')
  , conf = require('../conf/authconf')

describe('라우팅', function() {
  var server;
  before(function() {
    server = require('../app')
  });
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
    var ea, everyauthMock, server;

    before(function() {
      server = require('../app')
      ea = require('../libs/everyauth')

      everyauthMock = ea.init();
      everyauthMock.twitter
      .consumerKey(conf.twitter.consumerKey)
      .consumerSecret(conf.twitter.consumerSecret)
      .getRequestToken(function() {
        var p = this.Promise();
        return p.fulfill({});
      })
      .findOrCreateUser( function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
        clog.debug('session: ' + util.inspect(session));
        clog.debug('accessToken: ' + util.inspect(accessToken));
        clog.debug('accessTokenSecret: ' + util.inspect(accessTokenSecret));
        clog.debug('twitterUserMetadata: ' + util.inspect(twitterUserMetadata));
        var promise = this.Promise();
        authManager.findAcountBy(twitterUserMetadata.id, AuthOriginEnum.twitter, function (err, user) {
          if (err) return promise.fail(err);
          if (user) {
            promise.fulfill(user);
          } else {
            authManager.addNewAcount(twitterUserMetadata, AuthOriginEnum.twitter, function(err, insertedUser) {
              promise.fulfill(insertedUser);
            });
          }
        });
        return promise;
      })
    });
    after(function() {
      delete require.cache[require.resolve('../libs/everyauth')];
      delete require.cache[require.resolve('everyauth')];
      delete require.cache[require.resolve('everyauth/lib/modules/twitter')];
    });
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
  });
});

