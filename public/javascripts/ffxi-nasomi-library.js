/**
 *
 * 'bone_harness_+1'.replace(new RegExp('_', 'g'), ' ').toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
    return letter.toUpperCase(); } );
 *
 */

var FFXI;
(function (FFXI) {

    var NasomiUtils = (function () {
        function NasomiUtils(config) {
            var _this = this;
        }

        /**
         * createElementFromHTML
         * @param htmlString
         * @returns {Node | null}
         */
        NasomiUtils.prototype.createElementFromHTML = function (htmlString) {
            var div = document.createElement('div');
            div.innerHTML = htmlString.trim();
            return div.firstChild;
        };
        /**
         * createElementFromHTML
         * @param htmlString
         * @returns {Node | null}
         */
        NasomiUtils.prototype.createElementsFromHTML = function (htmlString) {
            var div = document.createElement('div');
            div.innerHTML = htmlString.trim();
            return (div.children ? div.children : div.firstChild);
        };
        /**
         * getLocalStorage
         * @param objectId string
         */
        NasomiUtils.prototype.getLocalStorage = function (objectId) {
            var objectBlob;
            if(typeof Storage !== "undefined") {
                objectBlob = localStorage.getItem(objectId);
                if (objectBlob) { objectBlob = JSON.parse(objectBlob); }
            }
            return objectBlob;
        };
        /**
         * setLocalStorage
         * @param objectId string
         * @param objectData object
         */
        NasomiUtils.prototype.setLocalStorage = function (objectId, objectData) {
            if(typeof Storage !== "undefined") {
                localStorage.setItem(objectId, JSON.stringify(objectData));
            }
        };
        /**
         * fetchQuery
         * @param options
         * @param callback
         */
        NasomiUtils.fetchQuery = function (options, callback) {
            var responseJSON = {};
            var xhr = new XMLHttpRequest();
            xhr.open(options.method, options.url);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        responseJSON = JSON.parse(xhr.responseText);
                    } catch (e) {
                        responseJSON = {};
                    }
                    callback(xhr.status, responseJSON);
                }
                else if (xhr.status !== 200) {
                    try {
                        responseJSON = JSON.parse(xhr.responseText);
                    } catch (e) {
                        responseJSON = {};
                    }
                    callback(xhr.status, responseJSON);
                }
            };
            xhr.send(this.fetchParams(options.params));
        };
        /**
         * fetchParams
         * @param object
         * @returns {string}
         */
        NasomiUtils.fetchParams = function (object) {
            var encodedString = '';
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    if (encodedString.length > 0) {
                        encodedString += '&';
                    }
                    encodedString += encodeURI(prop + '=' + object[prop]);
                }
            }
            return encodedString;
        }
        return NasomiUtils;
    }());
    FFXI.NasomiUtils = NasomiUtils;

    var NasomiAuction = (function () {
        function NasomiAuction(config) {
            var _this = this;
        }

        /**
         *
         * @param config
         */
        NasomiAuction.prototype.validateConfig = function (config) {

        };
        /**
         *
         * @param params
         * @param callback
         */
        NasomiAuction.search = function (params, callback) {
            var options = {
                method: 'post',
            };
            if (params.hasOwnProperty('charname')) {
                options.url = '/api/searchCharByName';
                options.params = { charname: params.charname.trim() };
            }
            if (params.hasOwnProperty('charid')) {
                options.url = '/api/searchChar';
                options.params = { charid: Math.floor(params.charid) };
            }
            if (params.hasOwnProperty('itemname')) {
                options.url = '/api/searchItemByName';
                options.params = { itemname: params.itemname.trim() };
            }
            if (params.hasOwnProperty('itemid')) {
                options.url = '/api/searchItem';
                options.params = { itemid: Math.floor(params.itemid), stack: (params.stack || 0) };
            }
            if (callback) {
                NasomiAuction.searchRequest(options, function (status, results) {
                    callback();
                    NasomiAuction.renderResults(status, results);
                });
            } else {
                NasomiAuction.searchRequest(options, NasomiAuction.renderResults);
            }
        };
        /**
         *
         * @param status
         * @param results
         */
        NasomiAuction.renderResults = function (status, results) {
            var nasomiInterface = new FFXI.NasomiInterface(),
                searchResultsElement = document.getElementById('searchResults');

            nasomiInterface.clearAuctionResults(searchResultsElement);
            if (results.hasOwnProperty('sales')) {
                nasomiInterface.renderAuctionResultsHeader(searchResultsElement, results);
            }
            if (results.hasOwnProperty('sale_list')) {
                nasomiInterface.renderAuctionResults(searchResultsElement, results['sale_list']);
            }
            if (results.hasOwnProperty('list')) {
                nasomiInterface.renderAuctionResults(searchResultsElement, results['list']);
            }
            if (results.length > 0) {
                nasomiInterface.renderAuctionResults(searchResultsElement, results);
            }
        };
        /**
         *
         * @param options
         * @param callback
         */
        NasomiAuction.searchRequest = function (options, callback) {
            FFXI.NasomiUtils.fetchQuery({
                method: options.method,
                url: options.url,
                params: options.params
            }, callback);
        };
        return NasomiAuction;
    }());
    FFXI.NasomiAuction = NasomiAuction;

    var NasomiAuctionConfig = (function () {
        function NasomiAuctionConfig() {
            var _this = this;
            this.debug = false;
        }
        NasomiAuctionConfig.getStructure = function (callback) {
            NasomiUtils.fetchQuery({
                method: 'get',
                url: '/json/structure.json',
            }, (callback ? callback : function (status, response) {
                
            }));
        };
        NasomiAuctionConfig.getStructureItems = function () {

        };
        return NasomiAuctionConfig;
    }());
    FFXI.NasomiAuctionConfig = NasomiAuctionConfig;

    var NasomiInterface = (function () {
        function NasomiInterface() {
            var _this = this;
            this.debug = false;
            this.utils = new FFXI.NasomiUtils();
        }

        NasomiInterface.prototype.renderAuctionCategories = function (results, asHTML) {
            var auctionCategoryGroup = '<div class="list-group mb-3">{{category_items}}</div>';
            var auctionCategoryHeading = '<div class="list-group-item list-group-item-success"><strong>{{title}}</strong></div>';
            var auctionCategoryItem = '<a class="list-group-item list-group-item-warning">{{title}}</a>';
            var auctionCategoryGroupHTML = '';
            var auctionCategoryHTML = '';

            results.forEach(function (resultGroup) {
                auctionCategoryGroupHTML = '';
                auctionCategoryHTML += auctionCategoryGroup;
                if (resultGroup.hasOwnProperty('groupId')) {
                    auctionCategoryGroupHTML += auctionCategoryHeading.replace('{{title}}', resultGroup.title);
                } else if (resultGroup.hasOwnProperty('id')) {
                    auctionCategoryGroupHTML += auctionCategoryItem.replace('{{title}}', resultGroup.title);
                }
                auctionCategoryHTML = auctionCategoryHTML.replace('{{category_items}}', auctionCategoryGroupHTML);
            });

            return (asHTML === true ? this.utils.createElementsFromHTML(auctionCategoryHTML) : auctionCategoryHTML);
        };

        /**
         * RenderAuctionItem
         * @param result object
         * @param asHTML boolean
         * @returns {string | object}
         * @constructor
         */
        NasomiInterface.prototype.renderAuctionItem = function (result, asHTML) {
            var auctionItemSold = '<div class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1"><img class="float-left mr-1" src="{{item_icon_url}}" />{{item_name}}{{item_multiplier}}</h5><small>{{sell_date}}</small></div><div class="d-flex w-100 justify-content-between"><div><small class="d-block" data-user-name="{{name}}">Seller: {{name}}</small><small class="d-block" data-user-name="{{buyer}}">Buyer: {{buyer}}</small></div><div><small class="d-block">Price: {{price}} Gil</small><small class="d-block">Stack: {{stack_label}}</small></div></div>{{item_meta}}</div>';
            var auctionItem = '<div class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1"><img class="float-left mr-1" src="{{item_icon_url}}" />{{item_name}}</h5></div><ul class="nav nav-options justify-content-center"><li class="nav-item"><a class="nav-link fas fa-heart" data-fav-item-id="{{itemid}}"></a></li><li class="nav-item"><a class="nav-link fas fa-search" data-item-id="{{itemid}}" data-stack="0"></a></li><li class="nav-item"><a class="nav-link fas fa-search-plus disabled" data-item-id="{{itemid}}" data-stack="1"></a></li></ul></div>';
            var auctionItemMeta = '<ul class="nav nav-options justify-content-center"><li class="nav-item"><a class="nav-link fas fa-user" data-user-name="{{name}}"></a></li><li class="nav-item"><a class="nav-link fas fa-heart" data-fav-item-id="{{itemid}}" data-fav-item-name="{{item_name}}" data-fav-item-stack="{{stack}}"></a></li><li class="nav-item"><a class="nav-link fas fa-search" data-item-id="{{itemid}}" data-stack="0"></a></li><li class="nav-item"><a class="nav-link fas fa-search-plus disabled" data-item-id="{{itemid}}" data-stack="1"></a></li></ul>';
            var auctionItemHTML = '';

            if (result.hasOwnProperty('buyer')) {
                auctionItemHTML = auctionItemSold.replace('{{item_meta}}', auctionItemMeta);
            } else {
                auctionItemHTML = auctionItem + '';
            }

            Object.keys(result).forEach(function (key, index) {
                auctionItemHTML = auctionItemHTML.replace(new RegExp('{{' + key + '}}', 'g'), result[key]);
            });
            auctionItemHTML = auctionItemHTML.replace(new RegExp('{{stack_label}}', 'g'), (result.stack === '0' ? 'No' : 'Yes'));
            // auctionItemHTML = auctionItemHTML.replace(new RegExp('{{item_icon_url}}', 'g'), 'https://via.placeholder.com/32x32');
            auctionItemHTML = auctionItemHTML.replace(new RegExp('{{item_icon_url}}', 'g'), 'https://na.nasomi.com/auctionhouse/img/icons/icon/' + result.itemid + '.png');

            if (result.stack === '0') {
                auctionItemHTML = auctionItemHTML.replace(new RegExp('{{item_multiplier}}', 'g'), '');
            } else {
                auctionItemHTML = auctionItemHTML.replace(new RegExp('{{item_multiplier}}', 'g'), ' x' + result.stackSize);
            }
            if (result.stackSize !== '1') {
                auctionItemHTML = auctionItemHTML.replace(new RegExp('nav-link fas fa-search-plus disabled', 'g'), 'nav-link fas fa-search-plus');
            }

            return (asHTML === true ? this.utils.createElementFromHTML(auctionItemHTML) : auctionItemHTML);
        };

        NasomiInterface.prototype.clearAuctionResults = function (elementObject) {
            if (!elementObject) { return; }
            elementObject.innerHTML = '';
        };

        NasomiInterface.prototype.renderAuctionHeader = function (results, asHTML) {
            var auctionHeader = '<div class="list-group-item list-group-item-action flex-column align-items-start mb-3"><div class="d-flex w-100 justify-content-between"><div><h5 class="mb-1"><img class="float-left mr-1" src="{{item_icon_url}}" />{{item_name}}{{item_multiplier}}</h5></div><div><small class="d-block">Stock: {{stock}}</small><small class="d-block">Sell Frequency: {{stock_frequency}}</small></div></div></div>';
            var auctionItemHTML = '' + auctionHeader;
            var auctionStockFrequency = 'Slow'; // Slow, Normal, Fast

            if (results['sales'] && results['sales']['sold15days']) {
                if (Math.floor(results['sales']['sold15days']) > 500 &&
                    Math.floor(results['sales']['sold15days']) <= 1000) {
                    auctionStockFrequency = 'Normal';
                } else if (Math.floor(results['sales']['sold15days']) > 1000) {
                    auctionStockFrequency = 'Fast';
                }
            }

            if (results.sale_list.length > 0) {
                Object.keys(results.sale_list[0]).forEach(function (key, index) {
                    auctionItemHTML = auctionItemHTML.replace(new RegExp('{{' + key + '}}', 'g'), results.sale_list[0][key]);
                });
            }

            auctionItemHTML = auctionItemHTML.replace(new RegExp('{{stock}}', 'g'), results['sales']['onStock']);
            auctionItemHTML = auctionItemHTML.replace(new RegExp('{{stock_frequency}}', 'g'), auctionStockFrequency);

            // auctionItemHTML = auctionItemHTML.replace(new RegExp('{{item_icon_url}}', 'g'), 'https://via.placeholder.com/32x32');
            auctionItemHTML = auctionItemHTML.replace(new RegExp('{{item_icon_url}}', 'g'), 'https://na.nasomi.com/auctionhouse/img/icons/icon/' + results.sale_list[0].itemid + '.png');

            if (results.sale_list[0].stack === '0') {
                auctionItemHTML = auctionItemHTML.replace(new RegExp('{{item_multiplier}}', 'g'), '');
            } else {
                auctionItemHTML = auctionItemHTML.replace(new RegExp('{{item_multiplier}}', 'g'), ' x' + results.sale_list[0].stackSize);
            }

            return (asHTML === true ? this.utils.createElementFromHTML(auctionItemHTML) : auctionItemHTML);
        };

        NasomiInterface.prototype.renderAuctionResultsHeader = function (elementObject, results) {

            if (!elementObject) { return; }
            if (results.hasOwnProperty('sales')) {
                elementObject.append( this.renderAuctionHeader(results, true));
            }
        };

        /**
         *
         * @param elementObject
         * @param results
         * @constructor
         */
        NasomiInterface.prototype.renderAuctionResults = function (elementObject, results) {
            if (!elementObject) { return; }
            for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {
                elementObject.append( this.renderAuctionItem(results[resultIndex], true));
            }
        };

        /**
         *
         * @param result
         * @param asHTML
         * @returns {*}
         */
        NasomiInterface.prototype.renderUserItem = function (result, asHTML) {
            var userItem = '<div data-user-id="{{id}}" data-user-name="{{name}}" class="list-group-item list-group-item-action flex-column align-items-start">{{name}}</div>';
            var userItemHTML = userItem + '';

            Object.keys(result).forEach(function (key, index) {
                userItemHTML = userItemHTML.replace(new RegExp('{{' + key + '}}', 'g'), result[key]);
            });

            return (asHTML === true ? this.utils.createElementFromHTML(userItemHTML) : userItemHTML);
        };

        /**
         *
         * @param elementObject
         * @param results
         */
        NasomiInterface.prototype.renderUserResults = function (elementObject, results) {
            if (!elementObject) { return; }
            elementObject.innerHTML = '';
            for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {
                elementObject.append( this.renderUserItem(results[resultIndex], true));
            }
        };

        return NasomiInterface;
    }());
    FFXI.NasomiInterface = NasomiInterface;

    var NasomiProfile = (function () {
        function NasomiProfile() {
            var _this = this;
            this.profile = {
                id: 0,
                name: '',
                race: 0,
                job: {
                    main: 0,
                    mainLvl: 0,
                    sub: 0,
                    subLvl: 0,
                },
                alliance: 0,
                friends: [],
                favourites: [],
            };
            this.debug = false;
        }
        /**
         * load
         * @returns {*|((reportName?: string) => void)|string}
         */
        NasomiProfile.prototype.load = function (createNew) {
            var NasomiUtils = new FFXI.NasomiUtils();
            var profile = NasomiUtils.getLocalStorage('ffxi-nasomi-profile');
            if (typeof (profile) === "object" && profile !== null) { this.profile = profile; }
            if (profile === null && createNew === true) { profile = this.profile; }
            return (profile || this.profile);
        };
        /**
         * update
         * @returns void
         */
        NasomiProfile.prototype.update = function () {
            var NasomiUtils = new FFXI.NasomiUtils();
            NasomiUtils.setLocalStorage('ffxi-nasomi-profile', this.profile);
        };
        /**
         *
         * @param profileName
         */
        NasomiProfile.prototype.find = function (profileName) {
            return [];
        };
        /**
         *
         */
        NasomiProfile.prototype.reset = function () {

        };
        /**
         *
         */
        NasomiProfile.prototype.updateJob = function () {
            return {};
        };
        /**
         *
         */
        NasomiProfile.prototype.getAvatarList = function () {
            return [];
        };
        /**
         *
         */
        NasomiProfile.prototype.updateAvatar = function (avatarId) {
            return {};
        };
        /**
         * favouriteAdd
         * @param favourite
         * @returns {object}
         */
        NasomiProfile.prototype.favouriteAdd = function (favourite) {
            var _this = this;
            var found = false;
            for(var i = 0; i < _this.profile.favourites.length; i++) {
                if (_this.profile.favourites[i].id === favourite.id) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                _this.profile.favourites.push(favourite);
            }
            return _this.profile;
        };
        /**
         * favouriteRemove
         * @param favouriteId
         * @returns {object}
         */
        NasomiProfile.prototype.favouriteRemove = function (favouriteId) {
            var _this = this;
            var found = false;
            for(var i = 0; i < _this.profile.favourites.length; i++) {
                if (_this.profile.favourites[i].id === favouriteId) {
                    _this.profile.favourites.splice(i, 1);
                    break;
                }
            }
            return _this.profile;
        };
        /**
         * friendsAdd
         * @param friend
         * @returns {object}
         */
        NasomiProfile.prototype.friendsAdd = function (friend) {
            var _this = this;
            var found = false;
            for(var i = 0; i < _this.profile.friends.length; i++) {
                if (_this.profile.friends[i].id === friend.id) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                _this.profile.friends.push(friend);
            }
            return _this.profile;
        };
        /**
         * friendsRemove
         * @param friendId
         * @returns {object}
         */
        NasomiProfile.prototype.friendsRemove = function (friendId) {
            var _this = this;
            var found = false;
            for(var i = 0; i < _this.profile.friends.length; i++) {
                if (_this.profile.friends[i].id === friendId) {
                    _this.profile.friends.splice(i, 1);
                    break;
                }
            }
            return _this.profile;
        };
        return NasomiProfile;
    }());
    FFXI.NasomiProfile = NasomiProfile;

    FFXI.currentProfile = new NasomiProfile();
    FFXI.currentProfile.load(true);
    FFXI.currentProfile.update();

})(FFXI || (FFXI = {}));