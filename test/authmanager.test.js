
// Run $ expresso

/**
 * Module dependencies.
 */

var authmanager = require('../libs/authmanager')
  , fixture = require('./fixture')
  , assert = require('assert');

module.exports = {
  'success test addNewAcount for twitter': function(){
    authmanager.addNewAcount(fixture.twitter, 'testname', function(result) {
      assert.eql(true, result);
    });
  }
};
