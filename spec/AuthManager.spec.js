var authmanager = require('../libs/authmanager')
  , fixture = require('./fixture');

describe('authmanager', function() {
  it('should addNewAcount for Twitter be passed', function() {
    var result = authmanager.addNewAcount(fixture.twitter, 'testname', function(result) {
      expect(result).toBeTruthy();
    });
  });
});
 
