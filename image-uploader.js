const fs = require('fs');
const path = require('path');
const request = require('request');
const items = require('./public/json/structure-items.json');

const applicationSettings = {
    targetUrl: 'https://na.nasomi.com/auctionhouse/img/icons/icon/',
    targetFile: '',
    index: 0,
    iconList: []
};

let download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-count: ' + applicationSettings.iconList.length);
        console.log('content-file:', filename);
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request
            .get(uri)
            .on('error', function (err){
                console.log(err);
            })
            .pipe(fs.createWriteStream(filename))
            .on('close', callback);
    });
};

let processIconFile = function () {
    let itemId = applicationSettings.iconList.shift();
    if (!itemId) { return false; }
    let targetFile = itemId + '.png';
    if (!fs.existsSync('public/icons/' + targetFile)) {

        download(applicationSettings.targetUrl + targetFile, 'public/icons/' + targetFile, function() {

            setTimeout(function () {
                processIconFile();
            }, 500);

        });

    } else {

        setTimeout(function () {
            processIconFile();
        }, 100);

    }
};


items.forEach(function (item) {
    let targetFile = item.itemid + '.png';
    if (!fs.existsSync('public/icons/' + targetFile)) {
        applicationSettings.iconList.push(item.itemid);
    }
});

console.log('content-scan: in ', 5);

setTimeout(function () {
    processIconFile();
}, 5000);