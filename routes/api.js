/**
 * Created by Nigel.Britton on 23/07/2018.
 */

'use strict';

var express = require('express'),
    router = express.Router(),
    debug = require('debug')('nasomi-auctionhouse-app:api');

var loadContent = require('../lib/loadContent')();

router.post('/searchCharByName', function(req, res, next) {
    loadContent.searchCharByName( req.body.charname )
        .then(function (response) {
            debug(response);
            if (response.length === 1) {
                loadContent.searchChar( response[0].id )
                    .then(function (response) {
                        res.send(response);
                    });
            } else {
                res.send(response);
            }
        }, function (err) {
            debug(err);
            // res.statusCode = 500;
            res.send([]);
        });
});

router.post('/searchChar', function(req, res, next) {
    loadContent.searchChar( req.body.charid )
        .then(function (response) {
            res.send(response);
        });
});

router.post('/searchItemByName', function(req, res, next) {
    loadContent.searchItemByName( req.body.itemname )
        .then(function (response) {
            res.send(response);
        });
});

router.post('/searchItem', function(req, res, next) {
    loadContent.searchItem( req.body.itemid, req.body.stack )
        .then(function (response) {
            res.send(response);
        }, function (err) {
            debug(err);
            // res.statusCode = 500;
            res.send([]);
        });
});

router.get('/getPopularCharacters', function(req, res, next) {
    res.send(loadContent.getPopularCharacters());
});

router.get('/getPopularItems', function(req, res, next) {
    res.send(loadContent.getPopularItems());
});

module.exports = router;