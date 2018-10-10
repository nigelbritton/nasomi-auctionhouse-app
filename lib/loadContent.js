/**
 * Created by Nigel.Britton on 23/07/2018.
 */

'use strict';

var fs = require('fs'),
    request = require('request'),
    md5 = require('md5'),
    promise = require('promise'),
    debug = require('debug')('nasomi-auctionhouse-app:loadContent');

module.exports = function ( contentConfig ) {

    var contentService = {

        requestTimeout: 5000,
        cacheQueueInterval: 10,
        cacheQueue: [],
        cachedContent: {},
        cachedCharacters: {},
        popularContentCharacters: {},
        popularContentItems: {},

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
     * updatePopularCharacter
     * @param charid number
     * @param charname string
     */
    contentService.updatePopularCharacter = function ( charid, charname ) {
        if (!this.popularContentCharacters[charid]) { this.popularContentCharacters[charid] = { counter: 0, charname: charname }; }
        this.popularContentCharacters[charid].counter++;
        this.popularContentCharacters[charid].updated = new Date().getTime();
    };

    contentService.updateCachedCharacters = function ( responseObjectItemList ) {
        if (responseObjectItemList.length === 0) { return false; }
        responseObjectItemList.forEach(function ( objectItem, index ) {
            contentService.cachedCharacters[objectItem.name] = {
                id: objectItem.id,
                updated: new Date().getTime()
            }
        });
        contentService.setCache( 'cachedCharacters', contentService.cachedCharacters );
    };

    /**
     * popularContentItems
     * @param itemid number
     */
    contentService.updatePopularItem = function ( itemid, itemname ) {
        if (!this.popularContentItems[itemid]) { this.popularContentItems[itemid] = { counter: 0, itemname: itemname }; }
        this.popularContentItems[itemid].counter++;
        this.popularContentItems[itemid].updated = new Date().getTime();
    };

    /**
     *
     * @returns {popularContentCharacters}
     */
    contentService.getPopularCharacters = function (  ) {
        return this.popularContentCharacters;
    };

    /**
     *
     * @returns {popularContentItems}
     */
    contentService.getPopularItems = function (  ) {
        return this.popularContentItems;
    };

    /**
     * searchCharByName
     * @param charname string
     */
    contentService.searchCharByName = function ( charname ) {

        var options = { method: this.contentEndpoints.searchCharByName.method,
            url: this.contentEndpoints.searchCharByName.url,
            timeout: this.requestTimeout,
            time: true,
            headers:
                { 'Cache-Control': 'no-cache', 'Content-Type': 'application/x-www-form-urlencoded' },
            form: { charname: charname } };

        return new promise(function (resolve, reject) {
            var cacheId = md5('searchCharByName'+charname);
            var cachedObject = contentService.getCache( cacheId );
            if (cachedObject === false) {
                debug(options);
                request(options, function (error, response, body) {
                    debug(options);
                    if (error) {
                        throw error;
                        // reject(error);
                    } else {
                        var postDataReturned = JSON.parse(body);
                        debug(body);
                        contentService.setCache(cacheId, postDataReturned, 3600);
                        resolve(postDataReturned);
                    }
                });
            } else {
                resolve(cachedObject);
            }
        });

    };

    /**
     * searchChar
     * @param charid number
     */
    contentService.searchChar = function ( charid ) {

        var options = { method: this.contentEndpoints.searchChar.method,
            url: this.contentEndpoints.searchChar.url,
            timeout: this.requestTimeout,
            time: true,
            headers:
                { 'Cache-Control': 'no-cache', 'Content-Type': 'application/x-www-form-urlencoded' },
            form: { charid: charid } };

        return new promise(function (resolve, reject) {
            var cacheId = md5('searchChar'+charid);
            var cachedObject = contentService.getCache( cacheId );
            if (cachedObject === false) {
                debug(options);
                request(options, function (error, response, body) {
                    debug(options);
                    if (error) {
                        throw error;
                        //reject(error);
                    } else {
                        debug('searchChar(); Success in ' + response.elapsedTime + 'ms');
                        var postDataReturned = JSON.parse(body);
                        debug(body);
                        contentService.updateCachedCharacters( postDataReturned );
                        // contentService.updatePopularCharacter( charid, postDataReturned[0].name );
                        contentService.setCache(cacheId, postDataReturned);
                        resolve(postDataReturned);
                    }
                });
            } else {
                var postDataReturned = cachedObject;
                contentService.updatePopularCharacter( charid, postDataReturned[0].name );
                resolve(cachedObject);
            }
        });

    };

    /**
     *
     * @param itemname string
     */
    contentService.searchItemByName = function ( itemname ) {

        var options = { method: this.contentEndpoints.searchItemByName.method,
            url: this.contentEndpoints.searchItemByName.url,
            timeout: this.requestTimeout,
            time: true,
            headers:
                { 'Cache-Control': 'no-cache', 'Content-Type': 'application/x-www-form-urlencoded' },
            form: { itemname: itemname } };

        return new promise(function (resolve, reject) {
            var cacheId = md5('searchItemByName'+itemname);
            var cachedObject = contentService.getCache( cacheId );
            if (cachedObject === false) {
                request(options, function (error, response, body) {
                    debug(options);
                    if (error) {
                        reject(error);
                    } else {
                        var postDataReturned = JSON.parse(body);
                        contentService.setCache(cacheId, postDataReturned, 3600);
                        resolve(postDataReturned);
                    }
                });
            } else {
                resolve(cachedObject);
            }
        });

    };

    /**
     *
     * @param itemid number
     */
    contentService.searchItem = function ( itemid, stack ) {

        var options = { method: this.contentEndpoints.searchItem.method,
            url: this.contentEndpoints.searchItem.url,
            timeout: this.requestTimeout,
            time: true,
            headers:
                { 'Cache-Control': 'no-cache', 'Content-Type': 'application/x-www-form-urlencoded' },
            form: { itemid: itemid, stack: stack } };

        return new promise(function (resolve, reject) {
            var cacheId = md5('searchItem'+itemid+stack);
            var cachedObject = contentService.getCache( cacheId );
            if (cachedObject === false) {
                request(options, function (error, response, body) {
                    debug(options);
                    if (error) {
                        throw error;
                        // reject(error);
                    } else {
                        var postDataReturned = JSON.parse(body);
                        contentService.updateCachedCharacters( postDataReturned.sale_list );
                        contentService.updatePopularItem( itemid, postDataReturned.sale_list[0].item_name );
                        contentService.setCache(cacheId, postDataReturned);
                        resolve(postDataReturned);
                    }
                });
            } else {
                var postDataReturned = JSON.parse(cachedObject);
                contentService.updatePopularItem( itemid, postDataReturned.sale_list[0].item_name );
                resolve(cachedObject);
            }
        });

    };

    /**
     * updateCharacterAuctionListings
     */
    contentService.updateCharacterAuctionListings = function () {
        var cachedCharacterList = [],
            characterSearchProfile;

        debug('Running: updateCharacterAuctionListings();');

        return new promise(function (resolve, reject) {
            Object.keys(contentService.cachedCharacters).forEach(function (characterId) {
                cachedCharacterList.push({
                    id: contentService.cachedCharacters[characterId].id,
                    name: characterId,
                    updated: contentService.cachedCharacters[characterId].updated
                });
            });

            if (cachedCharacterList.length === 0) {
                debug('Aborted: updateCharacterAuctionListings::NO_CHARACTERS');
                reject({});
            }

            cachedCharacterList.sort(function (a, b) {
                return a['updated'] > b['updated'];
            });

            debug(cachedCharacterList);

            characterSearchProfile = cachedCharacterList.shift();
            // contentService.searchChar(characterSearchProfile.id);
            contentService.cachedCharacters[characterSearchProfile.name].updated = new Date().getTime();

            resolve(characterSearchProfile);
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
        this.cacheQueue.push(cacheId);
        this.cachedContent[cacheId] = {
            expires: new Date().getTime() + ((ttl ? ttl : 300) * 1000),
            data: blob
        };
        return true;
    };

    /**
     * cacheStorage
     */
    contentService.cacheStorage = function () {
        var cacheId = contentService.cacheQueue.shift(),
            cacheObject = {};

        if (cacheId) {
            cacheObject = contentService.getCache( cacheId );
            if (cacheObject) {
                fs.writeFile(__dirname + '/' + cacheId + '.dat', JSON.stringify(cacheObject), 'utf8', function (err) {
                    if (err) {

                    } else {

                    }
                });
            }
        }

    };

    /**
     * restoreCacheStorage
     */
    contentService.restoreCacheStorage = function () {
        fs.readFile(__dirname + '/cachedCharacters.dat', function (err, data) {
            if (err) throw err;
            try {
                contentService.cachedCharacters = JSON.parse(data);
            } catch (e) {
                throw e;
            }
        });
    };

    contentService.restoreCacheStorage();

    /**
     * Flush cacheQueue into static files
     */
    setInterval(function () {
        contentService.cacheStorage();
        /*contentService.updateCharacterAuctionListings()
            .then(function (characterSearchProfile) {
                debug(characterSearchProfile);
            });*/
    }, 1000 * contentService.cacheQueueInterval);

    return contentService;
};