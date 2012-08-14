var createScraper = require('../');
var fs = require('fs');

var scraper = createScraper();
scraper.on('data', function (obj) {
    console.dir(obj);
});

var s = fs.createReadStream(__dirname + '/data.txt');
s.pipe(scraper);
