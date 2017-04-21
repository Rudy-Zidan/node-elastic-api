var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    elastic    = require('./elastic'),
    csvHelper  = require('./helpers/csv_helper');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

var enableDebug = true;

csvHelper.convertToJSON("./data_source/restaurants.csv", function(jsonData) {
  elastic.build(jsonData);
});

router.get('/restaurants/search', function(req, res) {
    elastic.search(req.query.per_page, req.query.page , function(err, response) {
      if(!err) {
        res.json(response).status(200);
      } else {
        res.json(err).status(400);
      }
    });
});

app.use('/api', router);

// Display errors in case of debug enabled.
app.use(function (err, req, res, next) {
  if(enableDebug) {
    console.error(err.stack)
    res.json({error: err.stack}).status(500)
  } else {
    res.json({error: 'Something went wrong.'}).status(500)
  }
})

app.listen(port);

console.log("Server started on port: " + port);
