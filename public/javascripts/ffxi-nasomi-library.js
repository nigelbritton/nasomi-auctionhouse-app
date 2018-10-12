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
         */
        NasomiAuction.prototype.search = function (params) {
            // NasomiAuction.searchRequest()
        };
        /**
         *
         * @param params
         */
        NasomiAuction.prototype.renderResults = function (params) {

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
            }, callback(status, response));
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
         * savedAdd
         * @param saved
         * @returns {object}
         */
        NasomiProfile.prototype.savedAdd = function (saved) {
            var _this = this;
            var found = false;
            for(var i = 0; i < _this.profile.saved.length; i++) {
                if (_this.profile.saved[i].id == saved.id) {
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