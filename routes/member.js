var CONST = require('../conf/constant')
  , everyauth = require('../libs/everyauth')
  , authmanager = require('../libs/authmanager');

exports.joinForm = function(req, res){
  console.log(req.session.auth);
  console.log(everyauth.Promise());
  if(req.session.auth.me2day) {
    var q = req.query;
    var me2day = req.session.auth.me2day;
    if(me2day.token === q.token && !!q.result) {
      req.session.auth.loggedIn = true;
      me2day.user = {};
      me2day.user.id = q.user_id;
      me2day.user.key = q.user_key;
    }
  }
  res.render('join-form', {
    title: CONST.SITENAME + ' :: ' + '가입',
    siteName: CONST.SITENAME
  });
};

exports.processJoin = function(req, res) {
  authmanager.addNewAcount(req.session.auth, req.body.nickname, function() {
    res.redirect('/', 302);
  });
};

exports.requestMe2dayAuth = function(req, res) {
  everyauth.me2day(function(err, redirectUrl, token) {
    sess = req.session;
    sess.auth = {};
    sess.auth.me2day = {};
    sess.auth.me2day.token = token;
    res.redirect(redirectUrl, 303);
  });
};