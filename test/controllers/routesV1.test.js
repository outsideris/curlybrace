var should = require('should')
  , http = require('http')
  , authToken = require('../../conf/config').authToken;

describe('API V1', function() {
  var server;
  before(function() {
    server = require('../../app')
  });
  describe('태그명의 일부로 조회한다', function() {
    it('application/json으로 요청할 경우 JSON을 리턴한다', function(done) {
      http.get({
        path: '/v1/tags?q=jav&how=startWith'
        , port: 3000
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
  })
});

