var dbService = require('../models/dbService')
  , tagService = require('../models/tags');

tagService.init(dbService.init());

exports.findTags = function(req, res){
  if (req.query.how === 'startWith') {
    tagService.findTagsStartWith(req.query.q, function(err, tags) {
      if (req.accepts('application/json')) {
        if (err) {
          console.log(err);
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