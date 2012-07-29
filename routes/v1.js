var dbManager = require('../libs/dbManager')
  , tagService = require('../libs/tagService');

tagService.init(dbManager.init());

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