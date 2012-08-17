var dbService = require('../app/models/dbService');

var db = dbService.init();

var defaultTags = [
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

db.tags.insert(defaultTags);
