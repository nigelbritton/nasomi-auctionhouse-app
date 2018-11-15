var express = require('express');
var router = express.Router();

var version = require('../package.json').version;
var structureCategories = require('../public/json/structure.json');
var structureItems = require('../public/json/structure-items.json');

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

module.exports = router;
