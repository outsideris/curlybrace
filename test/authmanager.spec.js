var vows = require('vows')
  , assert = require('assert')
  , authmanager = require('../libs/authmanager')
  , fixture = require('./fixture')
  , CONST = require('../conf/constant')
  , Mongolian = require('mongolian');

vows.describe('auth manager').addBatch({
  'with users collection in mongodb': {
    topic: function() {
      var mongo = {};
      mongo.server = new Mongolian(CONST.MONGODB_HOST + ':' + CONST.MONGODB_POST);
      mongo.db = mongo.server.db(CONST.MONGODB_DB);
      mongo.users = mongo.db.collection(CONST.MONGODB_COLLECTION);
      //mongo.users.remove();
      return mongo;
    }
  , 'when twitter authentication is progress': {
      topic: function(mongo) {
        authmanager.addNewAcount(fixture.twitter, 'testname', this.callback);
      },
      'should new account be inserted': function(err, result) {
        assert.isTrue(result);
      }
    }
  , 'when user didnt loggined try to authentication': {
      topic: function(mongo) {
        fixture.twitter.loggedIn = false;
        authmanager.addNewAcount(fixture.twitter, 'testname', this.callback);
      },
      'should new account be not inserted': function(err, result) {
        assert.isFalse(result);
      }
    }
  , 'when twitter account is inserted': {
      topic: function(mongo) {
        mongo.users.insert(fixture.twitterfomatted);
        authmanager.findAcountByid(fixture.twitter.userId, 'twitter', this.callback);
      },
      'should find my account': function(err, user) {
        assert.equal(fixture.twitterfomatted.nickname, user.nickname);
      }
    }
  }
}).run();