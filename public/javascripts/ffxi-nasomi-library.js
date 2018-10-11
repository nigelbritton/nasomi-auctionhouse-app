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
        return NasomiUtils;
    }());
    FFXI.NasomiUtils = NasomiUtils;

    var NasomiAuction = (function () {
        function NasomiAuction(config) {
            var _this = this;
        }
        NasomiAuction.prototype.validateConfig = function (config) {

        };
        NasomiAuction.prototype.search = function (params) {

        };
        NasomiAuction.prototype.renderResults = function (params) {

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
            this.profile = {};
            this.debug = false;
        }
        NasomiProfile.load = function () {
            var NasomiUtils = new FFXI.NasomiUtils();
            this.profile = NasomiUtils.getLocalStorage('ffxi-nasomi-profile');
            return this.profile;
        };
        NasomiProfile.update = function (params) {
            var NasomiUtils = new FFXI.NasomiUtils();
        };
        return NasomiProfile;
    }());
    FFXI.NasomiProfile = NasomiProfile;

})(FFXI || (FFXI = {}));