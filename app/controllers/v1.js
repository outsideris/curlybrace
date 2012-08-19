var dbService = require('../models/dbService')
  , tagService = require('../models/tags')
  , logger = require('../../conf/config').logger;

var db = dbService.init();
db.on('connected', function(err, db) {
  tagService.init(db);
});

exports.findTags = function(req, res){
  if (req.query.how === 'startWith') {
    tagService.findTagsStartWith(req.query.q, function(err, tags) {
      if (req.accepts('application/json')) {
        if (err) {
          logger.error(err);
          res.send({
            success: false
            , results: []
          });
        } else {
          res.send({
            success: true
            , results: tags
          });
        }
      }
    });
  }
};