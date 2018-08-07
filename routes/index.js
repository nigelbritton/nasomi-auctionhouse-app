var express = require('express');
var router = express.Router();

var version = require('../package.json').version;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nasomi Auction House', version: version });
});

module.exports = router;
