var searchWidget = {
    settings: {
        searchForm: null,
        searchFormId: 'searchForm',
        searchFormSubmitButton: null,
        searchResults: null,
        searchResultsId: 'searchResults',
        searchField: null,
        searchFieldId: 'searchField',
    },
    cachedData: {
        characters: {}
    },
    init: function(options) {
        searchWidget.settings.searchForm = document.getElementById(searchWidget.settings.searchFormId);
        searchWidget.settings.searchFormSubmitButton = document.querySelector('#' + searchWidget.settings.searchFormId + ' button[type="submit"]');
        searchWidget.settings.searchResults = document.getElementById(searchWidget.settings.searchResultsId);
        searchWidget.settings.searchField = document.getElementById(searchWidget.settings.searchFieldId);

        if (searchWidget.getLocalStorage('characters')) {
            searchWidget.cachedData.characters = searchWidget.getLocalStorage('characters');
        }

        searchWidget.settings.searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            searchWidget.disableSearchForm();
            searchWidget.settings.searchResults.innerHTML = '';

            searchWidget.fetchQuery({
                method: 'post',
                url: '/api/searchCharByName',
                data: { charname: searchWidget.settings.searchField.value }
            }, function (resultsData) {

                resultsData.forEach(function (resultData) {
                    searchWidget.settings.searchResults.appendChild( searchWidget.buildResultUserList(resultData) );
                });
                searchWidget.enableSearchForm();

            });
        }, false);

        searchWidget.settings.searchResults.addEventListener('click', function(event) {
            event.preventDefault();
            searchWidget.disableSearchForm();
            if (event.target && event.target.dataset.hasOwnProperty('userId') && event.target.dataset.hasOwnProperty('userName')) {
                var userObject = {
                    userId: event.target.dataset['userId'],
                    userName: event.target.dataset['userName']
                };
                searchWidget.updateCharacterCache(userObject);
                searchWidget.settings.searchResults.innerHTML = '';
                searchWidget.fetchQuery({
                    method: 'post',
                    url: '/api/searchChar',
                    data: { charid: event.target.dataset['userId'] }
                }, function (resultsData) {

                    resultsData.forEach(function (resultData) {
                        searchWidget.settings.searchResults.appendChild( searchWidget.buildResultUserAuctionListings(resultData) );
                    });
                    searchWidget.enableSearchForm();

                });
            } else if (event.target && event.target.dataset.hasOwnProperty('itemId') && event.target.dataset.hasOwnProperty('stack')) {
                searchWidget.settings.searchResults.innerHTML = '';
                searchWidget.fetchQuery({
                    method: 'post',
                    url: '/api/searchItem',
                    data: {
                        itemid: event.target.dataset['itemId'],
                        stack: event.target.dataset['stack']}
                }, function (resultsData) {

                    resultsData.sale_list.forEach(function (resultData) {
                        searchWidget.settings.searchResults.appendChild( searchWidget.buildResultUserAuctionListings(resultData) );
                    });
                    searchWidget.enableSearchForm();

                });
            } else if (event.target && event.target.dataset.hasOwnProperty('userName')) {
                searchWidget.settings.searchResults.innerHTML = '';
                searchWidget.fetchQuery({
                    method: 'post',
                    url: '/api/searchCharByName',
                    data: { charname: event.target.dataset['userName'] }
                }, function (resultsData) {

                    resultsData.forEach(function (resultData) {
                        searchWidget.settings.searchResults.appendChild( searchWidget.buildResultUserList(resultData) );
                    });
                    searchWidget.enableSearchForm();

                });
            } else if (event.target && event.target.dataset) {
                console.log(event.target.dataset);
            }
        }, false);
    },

    /**
     *
     * @param objectId string
     */
    getLocalStorage: function (objectId) {
        var objectBlob;
        if(typeof Storage !== "undefined") {
            objectBlob = localStorage.getItem(objectId);
            if (objectBlob) { objectBlob = JSON.parse(objectBlob); }
        }
        return objectBlob;
    },

    /**
     *
     * @param objectId string
     * @param objectData object
     */
    setLocalStorage: function (objectId, objectData) {
        if(typeof Storage !== "undefined") {
            localStorage.setItem(objectId, JSON.stringify(objectData));
        }
    },

    updateCharacterCache: function (characterObject) {
        if (!this.cachedData.characters[characterObject.userId]) {
            this.cachedData.characters[characterObject.userId] = characterObject;
        }
        /*while (this.cachedData.characters.length > 5) {
            this.cachedData.characters.pop();
        }*/
        this.setLocalStorage('characters', this.cachedData.characters);
    },

    /**
     *
     */
    enableSearchForm: function () {
        searchWidget.settings.searchFormSubmitButton.disabled = false;
        searchWidget.settings.searchFormSubmitButton.classList.remove('disabled');
    },

    /**
     *
     */
    disableSearchForm: function () {
        searchWidget.settings.searchFormSubmitButton.disabled = true;
        searchWidget.settings.searchFormSubmitButton.classList.add('disabled');
    },

    /**
     *
     * @param options object
     * @param callback function
     */
    fetchQuery: function (options, callback) {
        $.ajax({
            type: options.method,
            dataType: "json",
            url: options.url,
            data: options.data,
            success: function (data) { callback(data); }
        });
    },

    /**
     *
     * @param resultData object
     * @returns {string}
     */
    buildResultUserList: function (resultData) {
        return searchWidget.createElementFromHTML('<a href="#' + resultData.id + '" data-user-id="' + resultData.id + '" data-user-name="' + resultData.name + '" class="list-group-item list-group-item-action flex-column align-items-start">' +
            resultData.name +
            '</a>');
    },

    /**
     *
     * @param resultData object
     * @returns {string}
     */
    buildResultUserAuctionListings: function (resultData) {
        return searchWidget.createElementFromHTML('<div class="list-group-item list-group-item-action flex-column align-items-start">' +
            '<div class="d-flex w-100 justify-content-between">' +
            '<h5 class="mb-1" data-item-id="' + resultData.itemid + '" data-stack="' + resultData.stack + '"><img class="float-left mr-1" src="https://na.nasomi.com/auctionhouse/img/icons/icon/' + resultData.itemid + '.png" />' + resultData.item_name + '</h5>' +
            '<small>' + resultData.sell_date + '</small>' +
            '</div>' +
            '<p class="mb-1">' + resultData.item_desc + '</p>' +
            '<div class="d-flex w-100 justify-content-between"> ' +
            '<div> ' +
            '<small class="d-block" data-user-name="' + resultData.name + '">Seller: ' + resultData.name + '</small> ' +
            '<small class="d-block" data-user-name="' + resultData.buyer + '">Buyer: ' + resultData.buyer + '</small> ' +
            '</div> ' +
            '<div> ' +
            '<small class="d-block">Price: ' + resultData.price + ' Gil</small> ' +
            '<small class="d-block">Stack: ' + (resultData.stack === '0' ? 'No' : 'Yes') + '</small> ' +
            '</div> ' +
            '</div> ' +
            '</div>');
    },

    /**
     *
     * @param htmlString string
     * @returns {Node}
     */
    createElementFromHTML: function (htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
            // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }
};

window.addEventListener('load', function(event) {
    searchWidget.init();
}, false);