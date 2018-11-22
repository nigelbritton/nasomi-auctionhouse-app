var express = require('express');
var router = express.Router();
var debug = require('debug')('nasomi-auctionhouse-app:routing');
var loadContent = require('../lib/loadContent')();

var version = require('../package.json').version;
var structureCategories = require('../public/json/structure.json');
var structureItems = require('../public/json/structure-items.json');

var getCategoryById = function (results, id) {
    var categoryObject = false;

    for (var i = 0; i < results.length; i++) {
        if (results[i].hasOwnProperty('id') &&
            parseInt(results[i]['id']) === id) {
            debug('Found:', results[i], id);
            categoryObject = results[i];
            break;
        } else if (results[i].hasOwnProperty('groups')) {
            categoryObject = getCategoryById(results[i]['groups'], id);
            if (categoryObject !== false) { return categoryObject; }
        } else {
            debug('Skipped:', results[i], id);
        }
    }

    return categoryObject;
};

var getItemById = function (results, id) {
    var itemObject = false;

    for (var i = 0; i < results.length; i++) {
        if (results[i].hasOwnProperty('itemid') &&
            parseInt(results[i]['itemid']) === id) {
            // debug('Found:', results[i], id);
            itemObject = results[i];
            break;
        } else {
            // debug('Skipped:', results[i], id);
        }
    }

    return itemObject;
};

var structureCategoriesCounter = {};

structureItems.forEach(function(result){
    if (result.hasOwnProperty('aH')) {
        if (!structureCategoriesCounter[result['aH']]) {
            structureCategoriesCounter[result['aH']] = 0;
        }
        structureCategoriesCounter[result['aH']]++;
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home', version: version });
});

router.get('/browse', function(req, res, next) {
    var structureCategoriesHTML = '';

    structureCategories.forEach(function (result) {
        if (result.hasOwnProperty('id')) {
            structureCategoriesHTML += '<div class="list-group mb-3"><a data-href="/browse/{{groupId}}" data-group-id="{{groupId}}" class="list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{item_counter}}</span></a>{{category_items}}</div>'.replace('{{groupId}}', result.id);
            if (structureCategoriesCounter[result['id']]) {
                structureCategoriesHTML = structureCategoriesHTML.replace('{{item_counter}}', structureCategoriesCounter[result['id']]);
            }
        } else {
            structureCategoriesHTML += '<div class="list-group mb-3"><div class="list-group-item list-group-item-success"><strong>{{title}}</strong></div>{{category_items}}</div>';
        }
        structureCategoriesHTML = structureCategoriesHTML.replace('{{title}}', result.title);
        if (result.hasOwnProperty('groups')) {
            var categoryGroupHTML = '';
            result['groups'].forEach(function (resultGroup) {
                if (resultGroup.hasOwnProperty('id')) {
                    categoryGroupHTML += '<a data-href="/browse/{{groupId}}" data-group-id="{{groupId}}" class="list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{item_counter}}</span></a>'.replace('{{title}}', resultGroup.title).replace('{{groupId}}', resultGroup.id);
                    if (structureCategoriesCounter[resultGroup['id']]) {
                        categoryGroupHTML = categoryGroupHTML.replace('{{item_counter}}', structureCategoriesCounter[resultGroup['id']]);
                    }
                } else {
                    categoryGroupHTML += '<div class="list-group-item list-group-item-success"><strong>{{title}}</strong></div>{{category_items}}'.replace('{{title}}', resultGroup.title);

                    if (resultGroup.hasOwnProperty('groups')) {
                        var categorySubGroupHTML = '';
                        resultGroup['groups'].forEach(function (resultSubGroup) {
                            if (resultSubGroup.hasOwnProperty('id')) {
                                categorySubGroupHTML += '<a data-href="/browse/{{groupId}}" data-group-id="{{groupId}}" class="list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center" style="padding-left: 40px;"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{item_counter}}</span></a>'.replace('{{title}}', resultSubGroup.title).replace('{{groupId}}', resultSubGroup.id);
                                if (structureCategoriesCounter[resultSubGroup.id]) {
                                    categorySubGroupHTML = categorySubGroupHTML.replace('{{item_counter}}', structureCategoriesCounter[resultSubGroup.id]);
                                }

                            } else {
                                categorySubGroupHTML += '<div class="list-group-item list-group-item-warning"><strong>{{title}}</strong></div>'.replace('{{title}}', resultSubGroup.title);
                            }
                        });
                        categoryGroupHTML = categoryGroupHTML.replace('{{category_items}}', categorySubGroupHTML);
                    } else {
                        categoryGroupHTML = categoryGroupHTML.replace('{{category_items}}', '');
                    }

                }
            });
            structureCategoriesHTML = structureCategoriesHTML.replace('{{category_items}}', categoryGroupHTML);
        } else {
            structureCategoriesHTML = structureCategoriesHTML.replace('{{category_items}}', '');
        }
        // searchResultsElement.appendChild(categoryGroup.firstChild);
    });

    res.render('browse', { title: 'Browse', version: version, structureCategoriesHTML: structureCategoriesHTML });
});

router.get('/browse/:groupId', function(req, res, next) {
    var structureCategoriesHTML = '',
        categoryGroupHTML = '';
    var structureCategory = {
        id: parseInt(req.params.groupId),
        title: ''
    };
    var structureItemsList = [];

    structureCategory = getCategoryById(structureCategories, structureCategory.id);
    debug(structureCategory);

    if (structureCategory.id > 0) {
        structureCategoriesHTML += '<div class="list-group mb-3"><a data-href="/browse/{{groupId}}" data-group-id="{{groupId}}" class="list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{item_counter}}</span></a>{{category_items}}</div>'.replace('{{groupId}}', structureCategory.id);
        if (structureCategoriesCounter[structureCategory.id]) {
            structureCategoriesHTML = structureCategoriesHTML.replace('{{item_counter}}', structureCategoriesCounter[structureCategory.id]);
        }
        structureCategoriesHTML = structureCategoriesHTML.replace('{{title}}', structureCategory.title);
        structureCategoriesHTML = structureCategoriesHTML.replace('{{groupId}}', structureCategory.id);

        structureItems.forEach(function(result) {
            if (result.hasOwnProperty('aH') && parseInt(result['aH']) === structureCategory.id) {
                var localName = result.name.replace(new RegExp('_', 'g'), ' ').toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
                    return letter.toUpperCase(); } );
                categoryGroupHTML += '<a data-href="/browse/item/{{id}}" class="list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center"><strong>{{title}}</strong></a>'.replace('{{id}}', result.itemid).replace('{{title}}', localName);
            }
        });
        structureCategoriesHTML = structureCategoriesHTML.replace('{{category_items}}', categoryGroupHTML);

    }

    res.render('browse', { title: 'Browse', version: version, structureCategoriesHTML: structureCategoriesHTML });
});

router.get('/browse/item/:itemId/:stack?', function(req, res, next) {
    var structureCategoriesHTML = '',
        categoryGroupHTML = '';
    var auctionStockFrequency = 'Slow',
        structureCategory,
        structureItem,
        structureItemSearch = {
            itemid: parseInt(req.params.itemId),
            stack: (req.params.stack && req.params.stack === '1' ? 1 : 0),
            name: ''
        };

    var auctionItemSold = '<div class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1"><img class="float-left mr-1" src="{{item_icon_url}}" />{{item_name}}{{item_multiplier}}</h5><small>{{sell_date}}</small></div><div class="d-flex w-100 justify-content-between"><div><small class="d-block" data-user-name="{{name}}">Seller: {{name}}</small><small class="d-block" data-user-name="{{buyer}}">Buyer: {{buyer}}</small></div><div><small class="d-block">Price: {{price}} Gil</small><small class="d-block">Stack: {{stack_label}}</small></div></div>{{item_meta}}</div>';

    var auctionItemMeta = '<ul class="nav nav-options justify-content-center"><li class="nav-item"><a class="nav-link fas fa-user" data-user-name="{{name}}"></a></li><li class="nav-item"><a class="nav-link fas fa-heart" data-fav-item-id="{{itemid}}" data-fav-item-name="{{item_name}}" data-fav-item-stack="{{stack}}"></a></li><li class="nav-item"><a class="nav-link fas fa-search" data-href="/browse/item/{{itemid}}"></a></li><li class="nav-item"><a class="nav-link fas fa-search-plus disabled" data-href="/browse/item/{{itemid}}/1"></a></li></ul>';

    structureItem = getItemById(structureItems, structureItemSearch.itemid);

    if (structureItem) {
        structureCategory = getCategoryById(structureCategories, structureItem.aH);
        structureItem.name = structureItem.name.replace(new RegExp('_', 'g'), ' ').toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
            return letter.toUpperCase(); } );

        structureCategoriesHTML += '<div class="list-group mb-3"><a data-href="/browse/{{groupId}}" data-group-id="{{groupId}}" class="list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{item_counter}}</span></a>{{category_items}}</div>';
        structureCategoriesHTML = structureCategoriesHTML.replace('{{groupId}}', structureCategory.id);
        structureCategoriesHTML = structureCategoriesHTML.replace('{{title}}', structureCategory.title);
        structureCategoriesHTML = structureCategoriesHTML.replace('{{item_counter}}', structureCategoriesCounter[structureItem.aH]);

        categoryGroupHTML += '<div class="list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{sale_speed}}</span></div>'.replace('{{title}}', structureItem.name);

        structureCategoriesHTML = structureCategoriesHTML.replace('{{category_items}}', categoryGroupHTML);

        loadContent.searchItem( structureItemSearch.itemid, structureItemSearch.stack )
            .then(function (response) {

                if (response['sales'] && response['sales']['sold15days']) {
                    if (Math.floor(response['sales']['sold15days']) > 500 &&
                        Math.floor(response['sales']['sold15days']) <= 1000) {
                        auctionStockFrequency = 'Normal';
                    } else if (Math.floor(response['sales']['sold15days']) > 1000) {
                        auctionStockFrequency = 'Fast';
                    }
                }
                structureCategoriesHTML = structureCategoriesHTML.replace('{{sale_speed}}', auctionStockFrequency);

                categoryGroupHTML = '';

                if (response.hasOwnProperty('sale_list')) {
                    response.sale_list.forEach(function (auctionItem) {
                        categoryGroupHTML += auctionItemSold;
                        categoryGroupHTML = categoryGroupHTML.replace(new RegExp('{{item_meta}}', 'g'), auctionItemMeta);

                        categoryGroupHTML = categoryGroupHTML.replace(new RegExp('{{item_icon_url}}', 'g'), '/icons/' + auctionItem.itemid +'.png');
                        categoryGroupHTML = categoryGroupHTML.replace(new RegExp('{{itemid}}', 'g'), auctionItem.itemid);
                        categoryGroupHTML = categoryGroupHTML.replace(new RegExp('{{item_name}}', 'g'), auctionItem.item_name);
                        categoryGroupHTML = categoryGroupHTML.replace(new RegExp('{{item_multiplier}}', 'g'), (auctionItem.stack === '1' ? ' x' + auctionItem.stackSize : ''));
                        categoryGroupHTML = categoryGroupHTML.replace(new RegExp('{{sell_date}}', 'g'), auctionItem.sell_date);
                        categoryGroupHTML = categoryGroupHTML.replace(new RegExp('{{name}}', 'g'), auctionItem.name);
                        categoryGroupHTML = categoryGroupHTML.replace(new RegExp('{{buyer}}', 'g'), auctionItem.buyer);
                        categoryGroupHTML = categoryGroupHTML.replace(new RegExp('{{price}}', 'g'), auctionItem.price);
                        categoryGroupHTML = categoryGroupHTML.replace(new RegExp('{{stack_label}}', 'g'), (auctionItem.stack === '0' ? 'No' : 'Yes'));

                        if (auctionItem.stackSize === '12' ||
                            auctionItem.stackSize === '99') {
                            categoryGroupHTML = categoryGroupHTML.replace('fa-search-plus disabled', 'fa-search-plus');
                        }

                    });
                    structureCategoriesHTML += categoryGroupHTML;
                }

                res.render('browse', { title: 'Browse', version: version, structureCategoriesHTML: structureCategoriesHTML });

            }).catch(function (error) {

                debug(error);
                res.render('browse', { title: 'Browse', version: version, structureCategoriesHTML: '' });

            });

    } else {

        res.render('browse', { title: 'Browse', version: version, structureCategoriesHTML: '' });

    }

});

router.get('/search/', function(req, res, next) {
    res.render('search', { title: 'Search', version: version });
});

router.get('/profile/', function(req, res, next) {
    res.render('profile', { title: 'Profile', version: version });
});

module.exports = router;
