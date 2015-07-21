var test = require('tape');
var createScraper = require('../');

test('strings', function (t) {
    t.plan(1);
    
    var scraper = createScraper();
    var obj = { a : 1, b : [ 2, 3, 4 ] };
    scraper.on('data', function (data) {
        t.same(obj, data);
    });
    
    scraper.write(JSON.stringify(obj));
    scraper.end();
});
