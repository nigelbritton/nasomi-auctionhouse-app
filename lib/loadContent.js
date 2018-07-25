/**
 * Created by Nigel.Britton on 23/07/2018.
 */

'use strict';

var fs = require('fs'),
    request = require('request'),
    promise = require('promise');

module.exports = function ( contentConfig ) {

    var contentService = {

        cachedContent: {},

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
            var cacheId = 'searchChar'+charid;
            var cachedObject = contentService.getCache( cacheId );
            if (cachedObject === false) {
                request(options, function (error, response, body) {
                    if (error) { reject(error); }
                    else {
                        contentService.setCache(cacheId, body);
                        resolve(body);
                    }
                });
            } else {
                resolve(cachedObject);
            }
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
    contentService.searchItem = function ( itemid, stack ) {

        var options = { method: this.contentEndpoints.searchItem.method,
            url: this.contentEndpoints.searchItem.url,
            headers:
                { 'Cache-Control': 'no-cache', 'Content-Type': 'application/x-www-form-urlencoded' },
            form: { itemid: itemid, stack: stack } };

        return new promise(function (resolve, reject) {
            var cacheId = 'searchItem'+itemid+stack;
            var cachedObject = contentService.getCache( cacheId );
            if (cachedObject === false) {
                request(options, function (error, response, body) {
                    if (error) { reject(error); }
                    else {
                        contentService.setCache(cacheId, body);
                        resolve(body);
                    }
                });
            } else {
                resolve(cachedObject);
            }
        });

    };

    /**
     * getCache
     * @param cacheId
     * @returns {(boolean|object)}
     */
    contentService.getCache = function ( cacheId ) {
        var cachedObject = this.cachedContent[cacheId];
        if (!cachedObject) {
            cachedObject = { data: false };
        } else {
            if (cachedObject.expires < new Date().getTime()) {
                cachedObject = { data: false };
                delete this.cachedContent[cacheId];
            }
        }
        return cachedObject.data;
    };

    /**
     * setCache
     * @param cacheId string
     * @param blob object
     * @param ttl number
     * @returns {boolean}
     */
    contentService.setCache = function ( cacheId, blob, ttl ) {
        if (!this.cachedContent[cacheId]) {

        } else {

        }
        this.cachedContent[cacheId] = {
            expires: new Date().getTime() + ((ttl ? ttl : 300) * 1000),
            data: blob
        };
        return true;
    };

    return contentService;
};