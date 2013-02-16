// 공통 상수 및 로거 설정
"use strict";
// Module dependencies.
var winston = require('winston');

// 사용하는 SNS 관련 상수
module.exports.authProvider = {
  facebook: {
    name: 'facebook'
    , nickNameField: 'displayName'
  }, twitter: {
    name: 'twitter'
    , nickNameField: 'displayName'
  }, google: {
    name: 'google'
    , nickNameField: 'name'
  }, github: {
    name: 'github'
    , nickNameField: 'displayName'
  }, me2day: {
    name: 'me2day'
    , nickNameField: 'nickname'
  }
};

// 웹서버 및 디비관련 상수
module.exports.env = {
  HOST: 'http://curlybrace.dev'
  , PORT: 3000
  , SITENAME: '{Curlybrace}'
  , MONGODB_HOST: 'localhost'
  , MONGODB_PORT: 27017
  , MONGODB_DB: 'curlybrace'
  , MONGODB_COLLECTION_USERS: 'users'
  , MONGODB_COLLECTION_TAGS: 'tags'
  , MONGODB_COLLECTION_QUESTIONS: 'questions'
  , MONGODB_COLLECTION_COUNTERS: 'counters'
};

module.exports.server = {

};

// SNS 인증 토큰
module.exports.authToken = {
  facebook: {
    appId: '176737185714840'
    , appSecret: '2ba8334436f52e84908bf69679e9c9f6'
  }
  , twitter: {
    consumerKey: 'g74Oq12GHvtDKgN0ivrepA'
    , consumerSecret: 'oZRjDVVUmPo0IvFpvmdu9fP2eF3ATKULQHnvC5io6vY'
  }
  , google: {
    clientId: '362125366221.apps.googleusercontent.com'
    , clientSecret: 'UYwiyPWx_rwTfB_Tg9Tq6xLA'
  }
  , github: {
    clientId: '2d727b667bc3dea85acf'
    , clientSecret: 'e8c185a395b3c93ce7656ae20d1f367f172fb34b'
  }
  , me2day: {
    key : '6c8bc00661adf619c93e4282f0faffe3'
    , nonce: '8D9FBE3A'
  }
};

// 로거
module.exports.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
      , timestamp: true
      //, handleExceptions: true
    })
  ]
});
