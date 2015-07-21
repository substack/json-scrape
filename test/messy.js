var test = require('tape');
var createScraper = require('../');
var fs = require('fs');
var chunky = require('chunky');

var TIMES = 100;
test('messy errorful noise', function (t) {
    t.plan(TIMES);
    
    function scrape () {
        var scraper = createScraper();
        var objects = [];
        
        scraper.on('data', function (obj) {
            objects.push(obj);
        });
        scraper.on('end', function () {
            t.same(objects, [
                { beep : 'boop' },
                [ 7, 8, 9 ],
                [ 4, 'a' ],
                { x : 10 },
            ]);
        });
        return scraper;
    }
    
    fs.readFile(__dirname + '/messy.txt', function (err, src) {
        for (var i = 0; i < TIMES; i++) (function () {
            var scraper = scrape();
            
            var chunks = chunky(src);
            chunks.forEach(function (chunk) {
                scraper.write(chunk);
            });
            
            scraper.end();
        })();
    });
});
