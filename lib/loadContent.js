/**
 * Created by Nigel.Britton on 23/07/2018.
 */

'use strict';

var fs = require('fs'),
    request = require('request'),
    promise = require('promise');

module.exports = function ( contentConfig ) {

    var contentService = {

        contentEndpoints: {
            searchCharByName: {
                method: 'post',
                url: 'https://na.nasomi.com/auctionhouse/data/ah-data/searchCharByName.php',
                fields: {
                    type: 'text',
                    name: 'charname'
                }
            },
            searchChar: {
                method: 'post',
                url: 'https://na.nasomi.com/auctionhouse/data/ah-data/searchChar.php',
                fields: {
                    type: 'number',
                    name: 'charid'
                }
            },
            searchItemByName: {
                method: 'post',
                url: 'https://na.nasomi.com/auctionhouse/data/ah-data/searchItemByName.php',
                fields: {
                    type: 'text',
                    name: 'itemname'
                }
            },
            searchItem: {
                method: 'post',
                url: 'https://na.nasomi.com/auctionhouse/data/ah-data/searchItem.php',
                fields: {
                    type: 'number',
                    name: 'itemid'
                }
            },
        }

    };


    /**
     * searchCharByName
     * @param charname string
     */
    contentService.searchCharByName = function ( charname ) {

        var options = { method: this.contentEndpoints.searchCharByName.method,
            url: this.contentEndpoints.searchCharByName.url,
            headers:
                { 'Cache-Control': 'no-cache', 'Content-Type': 'application/x-www-form-urlencoded' },
            form: { charname: charname } };

        return new promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                if (error) { reject(error); }
                else resolve(body);
            });
        });

    };

    /**
     * searchChar
     * @param charid number
     */
    contentService.searchChar = function ( charid ) {

        var options = { method: this.contentEndpoints.searchChar.method,
            url: this.contentEndpoints.searchChar.url,
            headers:
                { 'Cache-Control': 'no-cache', 'Content-Type': 'application/x-www-form-urlencoded' },
            form: { charid: charid } };

        return new promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                if (error) { reject(error); }
                else resolve(body);
            });
        });

    };

    /**
     *
     * @param itemname string
     */
    contentService.searchItemByName = function ( itemname ) {

    };

    /**
     *
     * @param itemid number
     */
    contentService.searchItem = function ( itemid ) {

    };

    return contentService;
};