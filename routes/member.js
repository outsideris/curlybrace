var CONST = require('../conf/constant')
  , everyauth = require('../libs/everyauth')
  , dbManager = require('../libs/dbManager')
  , authmanager = require('../libs/authManager');

authmanager.init(dbManager.init());

exports.processJoin = function(req, res) {
  authmanager.addNewAcount(req.session.auth, req.body.nickname, function() {
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
    title: CONST.SITENAME,
    siteName: CONST.SITENAME
  });
};