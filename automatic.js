/**
 *
 */

var fs = require('fs');
var cachedCharacter = fs.readFile('./lib/cachedCharacters.dat', {}, function (err, fileContents) {
    var cachedCharacters = {},
        cachedCharacterList = [];

    try {
        cachedCharacters = JSON.parse(fileContents);
    } catch (e) {

    }

    Object.keys(cachedCharacters).forEach(function (characterId) {
        cachedCharacterList.push({
            id: cachedCharacters[characterId].id,
            name: characterId,
            updated: cachedCharacters[characterId].updated
        });
    });

    cachedCharacterList.sort(function (a, b) {
        return a['updated'] > b['updated'];
    });

    console.log(cachedCharacterList);

});