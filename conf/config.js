var winston = require('winston');

module.exports.AuthOriginEnum = {
    facebook: 'facebook'
  , twitter: 'twitter'
  , google: 'google'
  , me2day: 'me2day'
};

module.exports.env = {
  HOST: 'http://curlybrace.com'
  , PORT: 3000
  , SITENAME: '{Curlybrace}'
  , MONGODB_HOST: 'localhost'
  , MONGODB_PORT: '27017'
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
    clientId: '330800073515.apps.googleusercontent.com'
    , clientSecret: 'CP7GNxJ5I31qllbcqKWojw5i'
  }
  , me2day: {
    key : '6c8bc00661adf619c93e4282f0faffe3'
  }
};

module.exports.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      handleExceptions: true
      , colorize: true
      , timestamp: true
    })
  ]
});
