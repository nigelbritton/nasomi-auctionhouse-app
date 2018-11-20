var express = require('express');
var router = express.Router();

var version = require('../package.json').version;
var structureCategories = require('../public/json/structure.json');
var structureItems = require('../public/json/structure-items.json');

var getCategoryById = function (results, id) {
    var categoryObject = false;

    for (var i = 0; i < results.length; i++) {
        if (results[i].hasOwnProperty('id') &&
            parseInt(results[i]['id']) === id) {
            console.log('Found:', results[i], id);
            categoryObject = results[i];
            break;
        } else if (results[i].hasOwnProperty('groups')) {
            categoryObject = getCategoryById(results[i]['groups'], id);
            if (categoryObject !== false) { return categoryObject; }
        } else {
            console.log('Skipped:', results[i], id);
        }
    }

    // results.forEach(function (result) { });
    return categoryObject;
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home', version: version });
});

router.get('/browse', function(req, res, next) {
    var structureCategoriesHTML = '';
    var structureCategoriesCounter = {};

    structureItems.forEach(function(result){
        if (result.hasOwnProperty('aH')) {
            if (!structureCategoriesCounter[result['aH']]) {
                structureCategoriesCounter[result['aH']] = 0;
            }
            structureCategoriesCounter[result['aH']]++;
        }
    });

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
    var structureCategoriesCounter = {};
    var structureItemsList = [];

    structureItems.forEach(function(result){
        if (result.hasOwnProperty('aH')) {
            if (!structureCategoriesCounter[result['aH']]) {
                structureCategoriesCounter[result['aH']] = 0;
            }
            structureCategoriesCounter[result['aH']]++;
        }
    });

    structureCategory = getCategoryById(structureCategories, structureCategory.id);
    console.log(structureCategory);

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
                categoryGroupHTML += '<a class="list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center"><strong>{{title}}</strong></a>'.replace('{{title}}', localName);
            }
        });
        structureCategoriesHTML = structureCategoriesHTML.replace('{{category_items}}', categoryGroupHTML);

    }

    res.render('browse', { title: 'Browse', version: version, structureCategoriesHTML: structureCategoriesHTML });
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
