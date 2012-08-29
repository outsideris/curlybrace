var winston = require('winston');

module.exports.AuthOriginEnum = {
    facebook: 'facebook'
  , twitter: 'twitter'
  , google: 'google'
  , github: 'github'
  , me2day: 'me2day'
};

module.exports.env = {
  HOST: 'http://curlybrace.dev'
  , PORT: 3000
  , SITENAME: '{Curlybrace}'
  , MONGODB_HOST: 'localhost'
  , MONGODB_PORT: 27017
  , MONGODB_DB: 'curlybrace'
  , MONGODB_COLLECTION_USERS: 'users'
  , MONGODB_COLLECTION_TAGS: 'tags'
};

module.exports.server = {

};

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

module.exports.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
      , timestamp: true
      //, handleExceptions: true
    })
  ]
});
