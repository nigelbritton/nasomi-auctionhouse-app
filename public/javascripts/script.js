var searchWidget = {
    settings: {
        searchForm: null,
        searchFormId: 'searchForm',
        searchResults: null,
        searchResultsId: 'searchResults'
    },
    init: function(options) {
        searchWidget.settings.searchForm = document.getElementById(searchWidget.settings.searchFormId);
        searchWidget.settings.searchResults = document.getElementById(searchWidget.settings.searchResultsId);
        searchWidget.settings.searchForm.addEventListener('submit', function(event) {
            var sampleData = [{"id":"19461","name":"Shimada","itemid":"16442","price":"500","stack":"0","date":"July 22nd 13:50:59","sale":"500","sell_date":"07 23 2018","time":"28.9628","buyer":"Dongle","item_name":"Fsd. Baghnakhs","item_desc":"DMG:+3 Delay:+66","name_singular":"Freesword's baghnakhs","name_plural":"pairs of Freesword's baghnakhs","stackSize":"1"},{"id":"19461","name":"Shimada","itemid":"511","price":"400","stack":"0","date":"July 22nd 13:51:28","sale":"400","sell_date":"07 22 2018","time":"3.7489","buyer":"Healfest","item_name":"Goblin Mask","item_desc":"","name_singular":"Goblin mask","name_plural":"Goblin masks","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"4733","price":"250","stack":"0","date":"July 15th 14:06:20","sale":"250","sell_date":"07 20 2018","time":"125.6758","buyer":"Pudgesr","item_name":"Protectra","item_desc":"","name_singular":"scroll of Protectra","name_plural":"scrolls of Protectra","stackSize":"1"},{"id":"19461","name":"Shimada","itemid":"17344","price":"600","stack":"0","date":"July 14th 03:57:46","sale":"600","sell_date":"07 20 2018","time":"151.2889","buyer":"Aselius","item_name":"Cornette","item_desc":"'Minuet'+1","name_singular":"cornette","name_plural":"cornettes","stackSize":"1"},{"id":"19461","name":"Shimada","itemid":"12653","price":"7000","stack":"0","date":"July 15th 14:06:53","sale":"7000","sell_date":"07 20 2018","time":"106.5850","buyer":"Kingus","item_name":"Mercenary's Gi","item_desc":"DEF:15 VIT+1","name_singular":"Mercenary's gi","name_plural":"Mercenary's gi","stackSize":"1"},{"id":"19461","name":"Shimada","itemid":"498","price":"190","stack":"0","date":"July 15th 04:14:44","sale":"190","sell_date":"07 16 2018","time":"29.8181","buyer":"Unico","item_name":"Yagudo Necklace","item_desc":"","name_singular":"Yagudo bead necklace","name_plural":"Yagudo bead necklaces","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"4099","price":"300","stack":"1","date":"July 14th 03:58:42","sale":"300","sell_date":"07 15 2018","time":"38.2892","buyer":"Jonjey","item_name":"Earth Crystal","item_desc":"A crystal infused with earth energy.","name_singular":"earth crystal","name_plural":"earth crystals","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"4099","price":"300","stack":"1","date":"July 14th 03:58:32","sale":"300","sell_date":"07 15 2018","time":"38.1931","buyer":"Yokoto","item_name":"Earth Crystal","item_desc":"A crystal infused with earth energy.","name_singular":"earth crystal","name_plural":"earth crystals","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"575","price":"50","stack":"0","date":"July 14th 12:40:29","sale":"50","sell_date":"07 15 2018","time":"24.3806","buyer":"Rimori","item_name":"Grain Seeds","item_desc":"Seeds for some kind of grain.","name_singular":"bag of grain seeds","name_plural":"bags of grain seeds","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"1156","price":"195","stack":"0","date":"July 14th 12:40:50","sale":"195","sell_date":"07 15 2018","time":"19.3422","buyer":"Malakyzek","item_name":"Crawler Calculus","item_desc":"","name_singular":"crawler calculus","name_plural":"crawler calculi","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"1156","price":"195","stack":"0","date":"July 14th 12:40:44","sale":"195","sell_date":"07 15 2018","time":"19.3408","buyer":"Malakyzek","item_name":"Crawler Calculus","item_desc":"","name_singular":"crawler calculus","name_plural":"crawler calculi","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"1156","price":"180","stack":"0","date":"July 14th 03:58:12","sale":"180","sell_date":"07 15 2018","time":"27.9094","buyer":"Malakyzek","item_name":"Crawler Calculus","item_desc":"","name_singular":"crawler calculus","name_plural":"crawler calculi","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"511","price":"300","stack":"0","date":"July 15th 04:14:34","sale":"300","sell_date":"07 15 2018","time":"1.7150","buyer":"Stackatk","item_name":"Goblin Mask","item_desc":"","name_singular":"Goblin mask","name_plural":"Goblin masks","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"511","price":"300","stack":"0","date":"July 15th 04:14:26","sale":"300","sell_date":"07 15 2018","time":"1.7139","buyer":"Stackatk","item_name":"Goblin Mask","item_desc":"","name_singular":"Goblin mask","name_plural":"Goblin masks","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"17389","price":"100","stack":"0","date":"July 14th 12:40:10","sale":"100","sell_date":"07 14 2018","time":"0.8308","buyer":"Gilant","item_name":"Bamboo Fish. Rod","item_desc":"A fishing rod made of bamboo.","name_singular":"bamboo fishing rod","name_plural":"bamboo fishing rods","stackSize":"1"},{"id":"19461","name":"Shimada","itemid":"4099","price":"300","stack":"1","date":"July 14th 12:39:53","sale":"300","sell_date":"07 14 2018","time":"0.2414","buyer":"Yohommies","item_name":"Earth Crystal","item_desc":"A crystal infused with earth energy.","name_singular":"earth crystal","name_plural":"earth crystals","stackSize":"12"},{"id":"19461","name":"Shimada","itemid":"511","price":"300","stack":"0","date":"July 14th 03:57:53","sale":"300","sell_date":"07 14 2018","time":"2.1558","buyer":"Ausrine","item_name":"Goblin Mask","item_desc":"","name_singular":"Goblin mask","name_plural":"Goblin masks","stackSize":"12"}];

            event.preventDefault();
            searchWidget.settings.searchResults.innerHTML = '';
            sampleData.forEach(function (resultData) {
                searchWidget.settings.searchResults.appendChild( searchWidget.buildResult(resultData) );
            })
        }, false);
    },

    buildResult: function (resultData) {
        return searchWidget.createElementFromHTML('<div class="list-group-item list-group-item-action flex-column align-items-start">' +
            '<div class="d-flex w-100 justify-content-between">' +
            '<h5 class="mb-1">' + resultData.item_name + '</h5>' +
            '<small>' + resultData.sell_date + '</small>' +
            '</div>' +
            '<p class="mb-1">' + resultData.item_desc + '</p>' +
            '<small>Buyer: ' + resultData.buyer + '</small> ' +
            '<small>Price: ' + resultData.price + ' Gil</small> ' +
            '</div>');
    },
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