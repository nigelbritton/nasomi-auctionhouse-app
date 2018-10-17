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
            var xhr = new XMLHttpRequest();
            xhr.open(options.method, options.url);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    callback(xhr.status, xhr.responseText);
                }
                else if (xhr.status !== 200) {
                    callback(xhr.status, xhr.responseText);
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
        NasomiAuction.prototype.search = function (params, callback) {
            var options = {
                method: 'post',
            };
            if (params.hasOwnProperty('charname')) {
                options.url = '/api/searchCharByName';
                options.charname = params.charname.trim();
            }
            if (params.hasOwnProperty('charid')) {
                options.url = '/api/searchChar';
                options.charid = params.charid;
            }
            NasomiAuction.searchRequest(options, this.renderResults(status, response));
        };
        /**
         *
         * @param status
         * @param results
         */
        NasomiAuction.prototype.renderResults = function (status, results) {
            var nasomiInterface = new FFXI.NasomiInterface(),
                searchResultsElement = document.getElementById('results');
            nasomiInterface.renderAuctionResults(searchResultsElement, results);
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
        return NasomiAuctionConfig;
    }());
    FFXI.NasomiAuctionConfig = NasomiAuctionConfig;

    var NasomiInterface = (function () {
        function NasomiInterface() {
            var _this = this;
            this.debug = false;
            this.utils = new FFXI.NasomiUtils();
        }

        /**
         * RenderAuctionItem
         * @param result object
         * @param asHTML boolean
         * @returns {string | object}
         * @constructor
         */
        NasomiInterface.prototype.renderAuctionItem = function (result, asHTML) {
            var auctionItemSold = '<div class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1"><img class="float-left mr-1" src="{{item_icon_url}}" />{{item_name}}</h5><small>{{sell_date}}</small></div><div class="d-flex w-100 justify-content-between"><div><small class="d-block" data-user-name="{{name}}">Seller: {{name}}</small><small class="d-block" data-user-name="{{buyer}}">Buyer: {{buyer}}</small></div><div><small class="d-block">Price: {{price}} Gil</small><small class="d-block">Stack: {{stack_label}}</small></div></div>{{item_meta}}</div>';
            var auctionItemMeta = '<ul class="nav nav-options justify-content-center"><li class="nav-item"><a class="nav-link fas fa-user" data-user-name="{{name}}"></a></li><li class="nav-item"><a class="nav-link fas fa-heart" data-fav-item-id="{{itemid}}"></a></li><li class="nav-item"><a class="nav-link fas fa-search" data-item-id="{{itemid}}" data-stack="0"></a></li><li class="nav-item"><a class="nav-link fas fa-search-plus" data-item-id="{{itemid}}" data-stack="1"></a></li></ul>';
            var auctionItemHTML = auctionItemSold.replace('{{item_meta}}', auctionItemMeta);

            Object.keys(result).forEach(function (key, index) {
                auctionItemHTML = auctionItemHTML.replace(new RegExp('{{' + key + '}}', 'g'), result[key]);
            });

            return (asHTML === true ? this.utils.createElementFromHTML(auctionItemHTML) : auctionItemHTML);
        };

        /**
         *
         * @param elementObject
         * @param results
         * @constructor
         */
        NasomiInterface.prototype.renderAuctionResults = function (elementObject, results) {
            if (!elementObject) { return; }
            elementObject.innerHTML = '';
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
                saved: [],
            };
            this.debug = false;
        }
        /**
         * load
         * @returns {*|((reportName?: string) => void)|string}
         */
        NasomiProfile.prototype.load = function () {
            var NasomiUtils = new FFXI.NasomiUtils();
            var profile = NasomiUtils.getLocalStorage('ffxi-nasomi-profile');
            if (typeof (profile) === "object") { this.profile = profile; }
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
         * savedAdd
         * @param saved
         * @returns {object}
         */
        NasomiProfile.prototype.savedAdd = function (saved) {
            var _this = this;
            var found = false;
            for(var i = 0; i < _this.profile.saved.length; i++) {
                if (_this.profile.saved[i].id === saved.id) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                _this.profile.saved.push(saved);
            }
            return _this.profile;
        };
        /**
         * savedRemove
         * @param savedId
         * @returns {object}
         */
        NasomiProfile.prototype.savedRemove = function (savedId) {
            var _this = this;
            var found = false;
            for(var i = 0; i < _this.profile.saved.length; i++) {
                if (_this.profile.saved[i].id == savedId) {
                    _this.profile.saved.splice(i, 1);
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
                if (_this.profile.friends[i].id == friend.id) {
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
                if (_this.profile.friends[i].id == friendId) {
                    _this.profile.friends.splice(i, 1);
                    break;
                }
            }
            return _this.profile;
        };
        return NasomiProfile;
    }());
    FFXI.NasomiProfile = NasomiProfile;

})(FFXI || (FFXI = {}));