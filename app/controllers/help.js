var env = require('../../conf/config').env;

exports.markdown = function(req, res) {
  res.render('help/markdown', {
    title: env.SITENAME,
    siteName: env.SITENAME,
    user: req.user
  });
};