var searchWidget = {
    settings: {
        searchForm: null,
        searchFormId: 'searchForm',
        searchFormSubmitButton: null,
        searchResults: null,
        searchResultsId: 'searchResults',
        searchField: null,
        searchFieldId: 'searchField',
        searchFieldType: null,
        searchFieldTypeId: 'searchFieldType',
        searchProgress: null,
        searchProgressId: 'searchProgress',
        sectionButtons: null,
    },
    cachedData: {
        characters: {},
        recentItemSearches: []
    },
    init: function(options) {
        searchWidget.settings.searchForm = document.getElementById(searchWidget.settings.searchFormId);
        searchWidget.settings.searchFormSubmitButton = document.querySelector('#' + searchWidget.settings.searchFormId + ' button[type="submit"]');
        searchWidget.settings.searchResults = document.getElementById(searchWidget.settings.searchResultsId);
        searchWidget.settings.searchField = document.getElementById(searchWidget.settings.searchFieldId);
        searchWidget.settings.searchFieldType = document.getElementById(searchWidget.settings.searchFieldTypeId);
        searchWidget.settings.searchProgress = document.getElementById(searchWidget.settings.searchProgressId);

        searchWidget.settings.sectionButtons = document.querySelectorAll('footer .navbar .nav-link');
        for (var buttonIndex = 0; buttonIndex < searchWidget.settings.sectionButtons.length; buttonIndex++) {
            searchWidget.settings.sectionButtons[buttonIndex].onclick = function(event) {
                try {
                    var sectionList = document.querySelectorAll('main section'),
                        targetSection = document.getElementById(this.dataset.id);
                    if (!targetSection.classList.contains('active')) {
                        for (var sectionIndex = 0; sectionIndex < sectionList.length; sectionIndex++) {
                            sectionList[sectionIndex].classList.remove('active');
                        }
                        targetSection.classList.add('active');
                    }
                } catch (e) {
                    alert( e );
                }
                return false;
            }
        }

        if (searchWidget.getLocalStorage('characters')) {
            searchWidget.cachedData.characters = searchWidget.getLocalStorage('characters');
        }

        if (searchWidget.getLocalStorage('recentItemSearches')) {
            searchWidget.cachedData.recentItemSearches = searchWidget.getLocalStorage('recentItemSearches');
        }

        searchWidget.settings.searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            searchWidget.disableSearchForm();
            searchWidget.settings.searchResults.innerHTML = '';
            searchWidget.settings.searchField.value.trim();

            if (searchWidget.settings.searchFieldType.classList.contains('active')) {
                searchWidget.fetchQuery({
                    method: 'post',
                    url: '/api/searchCharByName',
                    data: { charname: searchWidget.settings.searchField.value }
                }, function (resultsData) {
                    if (resultsData && resultsData.length > 0 && resultsData[0].itemid) {
                        resultsData.forEach(function (resultData) {
                            searchWidget.settings.searchResults.appendChild( searchWidget.buildResultUserAuctionListings(resultData) );
                        });
                    } else {
                        resultsData.forEach(function (result) {
                            searchWidget.settings.searchResults.appendChild( searchWidget.buildResultUserList(result) );
                        });
                    }
                    searchWidget.enableSearchForm();

                });
            } else {
                searchWidget.fetchQuery({
                    method: 'post',
                    url: '/api/searchItemByName',
                    data: { itemname: searchWidget.settings.searchField.value }
                }, function (resultsData) {

                    resultsData.list.forEach(function (result) {
                        searchWidget.settings.searchResults.appendChild( searchWidget.buildResultItemList(result) );
                    });
                    searchWidget.enableSearchForm();

                });
            }

        }, false);

        searchWidget.settings.searchFieldType.addEventListener('click', function(event) {
            searchWidget.disableSearchForm();
            if (searchWidget.settings.searchFieldType.classList.contains('active')) {
                searchWidget.settings.searchFieldType.classList.remove('active');
                searchWidget.settings.searchField.placeholder = "Item name; i.e. Moat Carp";
            } else {
                searchWidget.settings.searchFieldType.classList.add('active');
                searchWidget.settings.searchField.placeholder = "Character name; i.e. Shirukusan";
            }
            searchWidget.enableSearchForm();
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
                var itemObject = {
                    itemId: event.target.dataset['itemId'],
                    itemName: event.target.dataset['itemName']
                };
                searchWidget.updateRecentItemCache(itemObject);
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

                    if (resultsData.length > 0 && resultsData[0].itemid) {
                        resultsData.forEach(function (resultData) {
                            searchWidget.settings.searchResults.appendChild( searchWidget.buildResultUserAuctionListings(resultData) );
                        });
                    } else {
                        resultsData.forEach(function (resultData) {
                            searchWidget.settings.searchResults.appendChild( searchWidget.buildResultUserList(resultData) );
                        });
                    }
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
        this.setLocalStorage('characters', this.cachedData.characters);
    },

    updateRecentItemCache: function (recentItemSearch) {
        var itemFound = false;
        this.cachedData.recentItemSearches.forEach(function (item) {
            if (item.itemId === recentItemSearch.itemId) {
                itemFound = true;
            }
        });
        if (itemFound === false) { this.cachedData.recentItemSearches.unshift(recentItemSearch); }
        while (this.cachedData.recentItemSearches.length > 20) {
            this.cachedData.recentItemSearches.pop();
        }
        this.setLocalStorage('recentItemSearches', this.cachedData.recentItemSearches);
    },

    /**
     *
     */
    enableSearchForm: function () {
        searchWidget.settings.searchFormSubmitButton.disabled = false;
        searchWidget.settings.searchFormSubmitButton.classList.remove('disabled');
        searchWidget.settings.searchProgress.classList.add('d-none');
        searchWidget.settings.searchField.value = '';
    },

    /**
     *
     */
    disableSearchForm: function () {
        searchWidget.settings.searchFormSubmitButton.disabled = true;
        searchWidget.settings.searchFormSubmitButton.classList.add('disabled');
        searchWidget.settings.searchProgress.classList.remove('d-none');
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
    buildResultItemList: function (resultData) {
        return searchWidget.createElementFromHTML('<div class="list-group-item list-group-item-action flex-column align-items-start">' +
            '<div class="d-flex w-100 justify-content-between">' +
            '<h5 class="mb-1"><img class="float-left mr-1" src="https://na.nasomi.com/auctionhouse/img/icons/icon/' + resultData.itemid + '.png" />' + resultData.item_name + '</h5>' +
            // (resultData.stackSize === '1' ? '' : '<small data-item-id="' + resultData.itemid + '" data-stack="1" data-item-name="' + resultData.item_name + '">Stack</small>') +
            '</div>' +
            // '<p class="mb-1">' + resultData.item_desc + '</p>' +
            '<ul class="nav nav-options justify-content-center"><li class="nav-item"><a class="nav-link fas fa-heart" data-fav-item-id="' + resultData.itemid + '"></a></li><li class="nav-item"><a class="nav-link fas fa-search" data-item-id="' + resultData.itemid + '" data-stack="0"></a></li>' +
            (resultData.stackSize === '1' ? '' : '<li class="nav-item"><a class="nav-link fas fa-search-plus" data-item-id="' + resultData.itemid + '" data-stack="1"></a></li>') +
            '</ul>' +
            '</div>');
    },

    /**
     *
     * @param resultData object
     * @returns {string}
     */
    buildResultUserAuctionListings: function (resultData) {
        return searchWidget.createElementFromHTML('<div class="list-group-item list-group-item-action flex-column align-items-start">' +
            '<div class="d-flex w-100 justify-content-between">' +
            '<h5 class="mb-1"><img class="float-left mr-1" src="https://na.nasomi.com/auctionhouse/img/icons/icon/' + resultData.itemid + '.png" />' + resultData.item_name + '</h5>' +
            '<small>' + resultData.sell_date + '</small>' +
            '</div>' +
            // '<p class="mb-1">' + resultData.item_desc + '</p>' +
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
            '<ul class="nav nav-options justify-content-center"><li class="nav-item"><a class="nav-link fas fa-user" data-user-name="' + resultData.name + '"></a></li><li class="nav-item"><a class="nav-link fas fa-heart" data-fav-item-id="' + resultData.itemid + '"></a></li><li class="nav-item"><a class="nav-link fas fa-search" data-item-id="' + resultData.itemid + '" data-stack="0"></a></li>' +
            (resultData.stackSize === '1' ? '<li class="nav-item"><a class="nav-link fas fa-search-plus disabled"></a></li>' : '<li class="nav-item"><a class="nav-link fas fa-search-plus" data-item-id="' + resultData.itemid + '" data-stack="1"></a></li>') +
            '</ul>' +
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
    },


    screenChange: function ( event ) {
        try {
            var sectionList = document.querySelectorAll('main section'),
                targetSection = document.getElementById(event.dataset.id);
            // alert(sectionList.length);
            if (!targetSection.classList.contains('active')) {
                for (var sectionIndex = 0; sectionIndex < sectionList.length; sectionIndex++) {
                    sectionList[sectionIndex].classList.remove('active');
                }
                targetSection.classList.add('active');
            }
        } catch (e) {
            alert( e );
        }
        return false;
    }

};

window.addEventListener('load', function(event) {
    searchWidget.init();
}, false);