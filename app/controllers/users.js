var env = require('../../conf/config').env
  , dbService = require('../models/dbService')
  , users = require('../models/users');

var db = dbService.init();
db.on('connected', function(err, db) {
  users.init(db);
});

exports.loginForm = function(req, res) {
  res.render('loginForm', {
    title: env.SITENAME,
    siteName: env.SITENAME
  });
};