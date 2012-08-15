var should = require('should')
  , dbManager = require('../libs/dbManager')
  , tagService = require('../libs/tagService')
  , CONST = require('../conf/constant');

var tagFixture = [
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

describe('tagService', function() {
  var tags;
  before(function() {
    var db = dbManager.init({'tags':'tags_test'});
    tags = db.tags;
    require('util').inspect(tags);
    db.tags.insert(tagFixture);
    tagService.init(db);
  });
  after(function() {
    tags.remove();
  });
  describe('태그 조회', function() {
    it('특정 문자열로 시작하는 태그리스트를 조회한다', function(done) {
      tagService.findTagsStartWith('jav', function(err, tags) {
        tags.some(function(v) {
          return v.name == 'java';
        }).should.be.true;
        done();
      });
    });
  });
});

