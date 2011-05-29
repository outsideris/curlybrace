
// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../app')
  , assert = require('assert');


module.exports = {
  'test redirecting Twitter login URL': function(){
    assert.response(app,
      { 
         url: '/auth/twitter' 
       , method: 'GET'
      },
      { 
         status: 303
      },
      function(res){
         assert.match(res.headers.location, /^https:\/\/api\.twitter\.com\/oauth\/authorize\?oauth_token=/);
      });
  }

, 'test redirecting Google login URL': function(){
    assert.response(app,
      { 
         url: '/auth/google' 
       , method: 'GET'
      },
      { 
         status: 303
      },
      function(res){
         assert.match(res.headers.location, /^https:\/\/accounts\.google\.com\/o\/oauth2\/auth\?client_id=/);
      });
  }
, 'test redirecting Facebook login URL': function(){
    assert.response(app,
      { 
         url: '/auth/facebook' 
       , method: 'GET'
      },
      { 
         status: 303
      },
      function(res){
         assert.match(res.headers.location, /^https:\/\/www\.facebook\.com\/dialog\/oauth\?client_id=/);
      });
  }

};
