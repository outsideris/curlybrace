/*global describe:true, it:true, before:true, after:true */
"use strict";

var should = require('should')
  , dbService = require('../../app/models/dbService')
  , env = require('../../conf/config').env
  , tags = require('../../app/models/tags');

var tagFixture = module.exports.tagFixture = [
  {name: 'java'}
  , {name: 'scala'}
  , {name: 'node.js'}
  , {name: 'javascript'}
  , {name: 'c#'}
  , {name: 'html'}
  , {name: 'css'}
  , {name: 'php'}
  , {name: 'python'}
  , {name: 'ruby'}
  , {name: 'rails', alias:['ror', 'ruby on rails']}
  , {name: 'ios'}
  , {name: 'asp.net'}
  , {name: 'c'}
  , {name: 'c++'}
  , {name: 'objective-c'}
  , {name: 'spring framework'}
  , {name: 'regular expression', alias:['regex']}
  , {name: 'sql'}
  , {name: 'ajx'}
  , {name: 'xml'}
  , {name: 'database'}
  , {name: 'oracle'}
  , {name: 'mysql'}
  , {name: 'nosql'}
  , {name: 'rdbms'}
  , {name: 'mongodb'}
  , {name: 'cassandra'}
  , {name: 'redis'}
  , {name: 'memcached'}
  , {name: 'cloud'}
  , {name: 'jquery'}
  , {name: 'vim', alias:['vi']}
  , {name: 'eclipse'}
  , {name: 'git'}
  , {name: 'subversion', alias:['svn']}
  , {name: 'html5'}
  , {name: 'play'}
  , {name: 'mercurial', alias:['hg']}
  , {name: 'agile'}
  , {name: 'coffeescript'}
  , {name: 'ecmascript'}
  , {name: 'design pattern'}
  , {name: 'hadoop'}
  , {name: 'big data'}
  , {name: 'hbase'}
  , {name: 'pig'}
  , {name: 'hive'}
  , {name: 'ibatis'}
  , {name: 'mybatis'}
  , {name: 'hibernate'}
  , {name: 'maven', alias:['mvn']}
  , {name: 'ant'}
  , {name: 'gradle'}
  , {name: 'json'}
  , {name: 'tomcat'}
  , {name: 'jetty'}
  , {name: 'less'}
  , {name: 'sass'}
  , {name: 'backbone'}
  , {name: 'mssql'}
  , {name: 'rest'}
  , {name: 'sbt'}
  , {name: 'shell'}
];

describe('tags', function() {
  var tagsCollection;
  var db;
  before(function(done) {
    db = dbService.init();
    db.once('connected', function(err, pdb) {
      db = pdb;
      db.setTags(env.MONGODB_COLLECTION_TAGS + '_test');
      tagsCollection = db.tags;
      tagsCollection.insert(tagFixture, function(err, result) {
        should.not.exist(err);
        should.exist(result);
      });
      tags.init(db);
      done();
    });
  });
  after(function() {
    tagsCollection.remove(function(err, numberOfRemovedDocs) {
      should.not.exist(err);
      should.exist(numberOfRemovedDocs);
    });
    db.db.close();
    db.db = null;
  });
  describe('태그 조회', function() {
    it('특정 문자열로 시작하는 태그리스트를 조회한다', function(done) {
      // given
      var str = 'jav';
      // when
      tags.findTagsStartWith(str, function(err, tags) {
        // then
        tags.some(function(v) {
          return v.name === 'java';
        }).should.be.true;
        done();
      });
    });
    it('픽스처내의 태그는 조회할 수 있어야 한다', function(done) {
      // given
      var randomIndexInTagFixture = getRandomIndexInTagsFixture();
      var targetTag = tagFixture[randomIndexInTagFixture];
      // when
      tags.findOne(targetTag.name, function(err, tag) {
        // then
        should.not.exist(err);
        tag.name.should.equal(targetTag.name);
        done();
      });
    });
    it('존재하지 않는 태그는 null로 조회된다', function(done) {
      // given
      var targetTagName = 'notExistTagName';
      // when
      tags.findOne(targetTagName, function(err, tag) {
        // then
        should.not.exist(err);
        should.not.exist(tag);
        done();
      });
    });
    it('전체 태그 목록을 가져온다', function(done) {
      // given
      // when
      tags.getAll(function(err, tags) {
        // then
        should.not.exist(err);
        tags.length.should.equal(tagFixture.length);
        done();
      });
    });
    it('전달한 태그리스트가 모두 태그목록에 있는 경우 true를 반환한다', function(done) {
      // given
      var targetTags = [];
      for (var i = 0; i < 5; i++) {
        targetTags.push(tagFixture[getRandomIndexInTagsFixture()].name);
      }
      // when
      tags.isAllExistInTags(targetTags, function(err, isExist) {
        // then
        should.not.exist(err);
        isExist.should.be.true;
        done();
      });
    });
    it('전달한 태그리스트가 모두 태그목록에 있지 않은 경우 false를 반환한다', function(done) {
      // given
      var targetTags = [];
      for (var i = 0; i < 5; i++) {
        targetTags.push(tagFixture[getRandomIndexInTagsFixture()].name);
      }
      targetTags.push('notExistTagName');
      // when
      tags.isAllExistInTags(targetTags, function(err, isExist) {
        // then
        should.not.exist(err);
        isExist.should.not.be.true;
        done();
      });
    });
  });
});

function getRandomIndexInTagsFixture() {
  return Math.floor(Math.random() * ((tagFixture.length - 1) - 0 + 1)) + 0;
}