var CONST = require('../conf/constant');

exports.markdown = function(req, res) {
  res.render('help/markdown', {
    title: CONST.SITENAME,
    siteName: CONST.SITENAME
  });
};