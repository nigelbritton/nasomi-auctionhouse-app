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
            structureCategoriesHTML += '<div class="list-group mb-3"><a href="/browse/{{groupId}}" data-group-id="{{groupId}}" class="list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{item_counter}}</span></a>{{category_items}}</div>'.replace('{{groupId}}', result.id);
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
                    categoryGroupHTML += '<a href="/browse/{{groupId}}" data-group-id="{{groupId}}" class="list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{item_counter}}</span></a>'.replace('{{title}}', resultGroup.title).replace('{{groupId}}', resultGroup.id);
                    if (structureCategoriesCounter[resultGroup['id']]) {
                        categoryGroupHTML = categoryGroupHTML.replace('{{item_counter}}', structureCategoriesCounter[resultGroup['id']]);
                    }
                } else {
                    categoryGroupHTML += '<div class="list-group-item list-group-item-success"><strong>{{title}}</strong></div>{{category_items}}'.replace('{{title}}', resultGroup.title);

                    if (resultGroup.hasOwnProperty('groups')) {
                        var categorySubGroupHTML = '';
                        resultGroup['groups'].forEach(function (resultSubGroup) {
                            if (resultSubGroup.hasOwnProperty('id')) {
                                categorySubGroupHTML += '<a href="/browse/{{groupId}}" data-group-id="{{groupId}}" class="list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center" style="padding-left: 40px;"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{item_counter}}</span></a>'.replace('{{title}}', resultSubGroup.title).replace('{{groupId}}', resultSubGroup.id);
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
        structureCategoriesHTML += '<div class="list-group mb-3"><a href="/browse/{{groupId}}" data-group-id="{{groupId}}" class="list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{item_counter}}</span></a>{{category_items}}</div>'.replace('{{groupId}}', structureCategory.id);
        if (structureCategoriesCounter[structureCategory.id]) {
            structureCategoriesHTML = structureCategoriesHTML.replace('{{item_counter}}', structureCategoriesCounter[structureCategory.id]);
        }
        structureCategoriesHTML = structureCategoriesHTML.replace('{{title}}', structureCategory.title);
        structureCategoriesHTML = structureCategoriesHTML.replace('{{groupId}}', structureCategory.id);

        structureItems.forEach(function(result) {
            if (result.hasOwnProperty('aH') && parseInt(result['aH']) === structureCategory.id) {
                var localName = result.name.replace(new RegExp('_', 'g'), ' ').toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
                    return letter.toUpperCase(); } );
                categoryGroupHTML += '<a href="/browse/item/{{id}}" class="list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center"><strong>{{title}}</strong></a>'.replace('{{id}}', result.itemid).replace('{{title}}', localName);
            }
        });
        structureCategoriesHTML = structureCategoriesHTML.replace('{{category_items}}', categoryGroupHTML);

    }

    res.render('browse', { title: 'Browse', version: version, structureCategoriesHTML: structureCategoriesHTML });
});

router.get('/browse/item/:itemId', function(req, res, next) {
    var structureCategoriesHTML = '',
        categoryGroupHTML = '';
    var structureCategory,
        structureItem = {
            itemid: parseInt(req.params.itemId),
            name: ''
        };

    var auctionItemSold = '<div class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1"><img class="float-left mr-1" src="{{item_icon_url}}" />{{item_name}}{{item_multiplier}}</h5><small>{{sell_date}}</small></div><div class="d-flex w-100 justify-content-between"><div><small class="d-block" data-user-name="{{name}}">Seller: {{name}}</small><small class="d-block" data-user-name="{{buyer}}">Buyer: {{buyer}}</small></div><div><small class="d-block">Price: {{price}} Gil</small><small class="d-block">Stack: {{stack_label}}</small></div></div>{{item_meta}}</div>';

    structureItem = getItemById(structureItems, structureItem.itemid);

    if (structureItem) {
        structureCategory = getCategoryById(structureCategories, structureItem.aH);
        structureItem.name = structureItem.name.replace(new RegExp('_', 'g'), ' ').toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
            return letter.toUpperCase(); } );

        structureCategoriesHTML += '<div class="list-group mb-3"><a href="/browse/{{groupId}}" data-group-id="{{groupId}}" class="list-group-item list-group-item-action list-group-item-success d-flex justify-content-between align-items-center"><strong>{{title}}</strong><span class="badge badge-dark badge-pill">{{item_counter}}</span></a>{{category_items}}</div>';
        structureCategoriesHTML = structureCategoriesHTML.replace('{{groupId}}', structureCategory.id);
        structureCategoriesHTML = structureCategoriesHTML.replace('{{title}}', structureCategory.title);
        structureCategoriesHTML = structureCategoriesHTML.replace('{{item_counter}}', structureCategoriesCounter[structureItem.aH]);

        categoryGroupHTML += '<a href="/browse/item/{{id}}" class="list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center"><strong>{{title}}</strong></a>'.replace('{{id}}', structureItem.itemid).replace('{{title}}', structureItem.name);

        structureCategoriesHTML = structureCategoriesHTML.replace('{{category_items}}', categoryGroupHTML);

        loadContent.searchItem( structureItem.itemid, 0 )
            .then(function (response) {
                debug(response);

                if (response.hasOwnProperty('sale_list')) {
                    structureCategoriesHTML += auctionItemSold;
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
    var structureCategoriesHTML = '';

    res.render('browse', { title: 'Search', version: version, structureCategoriesHTML: structureCategoriesHTML });
});

router.get('/profile/', function(req, res, next) {
    var structureCategoriesHTML = '';

    res.render('browse', { title: 'Profile', version: version, structureCategoriesHTML: structureCategoriesHTML });
});

module.exports = router;
