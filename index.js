var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

var enableDebug = true;

router.get('/ping', function(req, res) {
    res.json({ message: 'pong' });
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
