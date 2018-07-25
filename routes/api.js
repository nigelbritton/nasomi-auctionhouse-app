/**
 * Created by Nigel.Britton on 23/07/2018.
 */

'use strict';

var express = require('express'),
    router = express.Router();

var loadContent = require('../lib/loadContent')();

router.post('/searchCharByName', function(req, res, next) {
    loadContent.searchCharByName( req.body.charname )
        .then(function (response) {
            res.send(response);
        });
});

router.post('/searchChar', function(req, res, next) {
    loadContent.searchChar( req.body.charid )
        .then(function (response) {
            res.send(response);
        });
});

router.post('/searchItemByName', function(req, res, next) {
    res.json({});
});

router.post('/searchItem', function(req, res, next) {
    loadContent.searchItem( req.body.itemid, req.body.stack )
        .then(function (response) {
            res.send(response);
        });
});

module.exports = router;