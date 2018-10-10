var express = require('express');
var router = express.Router();

var version = require('../package.json').version;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nasomi Auction House', version: version });
});

/* GET auction page. */
router.get('/auction', function(req, res, next) {
  res.render('auction', { title: 'Nasomi Auction House', version: version });
});

module.exports = router;
