var createScraper = require('../');
var fs = require('fs');
var chunky = require('chunky');

var scraper = createScraper();

scraper.on('data', function (obj) {
    console.dir(obj);
});

fs.readFile(__dirname + '/data.txt', function (err, src) {
    var chunks = chunky(src);
    chunks.forEach(function (chunk) {
        scraper.write(chunk);
    });
    
    scraper.end();
});
