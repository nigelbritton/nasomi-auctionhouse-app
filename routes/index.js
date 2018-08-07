var express = require('express');
var router = express.Router();

var version = require('../package.json').version;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('page-home', { title: 'Nasomi Auction House', version: version, page: { home: 'x' } });
});
router.get('/search', function(req, res, next) {
  res.render('page-search', { title: 'Nasomi Auction House', version: version, page: { search: 'x' } });
});
router.get('/profile', function(req, res, next) {
  res.render('page-profile', { title: 'Nasomi Auction House', version: version, page: { search: 'x' } });
});

module.exports = router;
