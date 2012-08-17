var env = require('../../conf/config').env
  , everyauth = require('../models/everyauth')
  , dbService = require('../models/dbService')
  , users = require('../models/users');

users.init(dbService.init());

exports.processJoin = function(req, res) {
  users.addNewAcount(req.session.auth, req.body.nickname, function() {
    res.redirect('/', 302);
  });
};

exports.requestMe2dayAuth = function(req, res) {
  everyauth.me2day(function(err, redirectUrl, token) {
    var sess = req.session;
    sess.auth = {};
    sess.auth.me2day = {};
    sess.auth.me2day.token = token;
    res.redirect(redirectUrl, 303);
  });
};

exports.loginForm = function(req, res) {
  res.render('loginForm', {
    title: env.SITENAME,
    siteName: env.SITENAME
  });
};