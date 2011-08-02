var authmanager = require('../libs/authmanager')
  , fixture = require('./fixture')
  , CONST = require('../conf/constant')
  , Mongolian = require('mongolian');

describe('authmanager', function() {
  var server = new Mongolian(CONST.MONGODB_HOST + ':' + CONST.MONGODB_POST);
  var db = server.db(CONST.MONGODB_DB);
  var users = db.collection(CONST.MONGODB_COLLECTION);
    
  beforeEach(function() {
     users.insert(fixture.twitter);
     console.log('before');
  });
  
  afterEach(function() {
     users.remove();
     console.log('after');
  });
  
  it('should addNewAcount for Twitter be passed', function() {
    var result = authmanager.addNewAcount(fixture.twitter, 'testname', function(result) {
      console.log(result);
      expect(result).toBeTruthy();
      console.log('test 1');
    });
  });
  
  it('should find user in twitter', function() {
    authmanager.findAcountByid(fixture.twitter.userId, 'twitter', function(user) {
      expect(user.nickname).toEqual(fixture.twitter.nickname);
      console.log('test 2');
    });
  });
});
 
