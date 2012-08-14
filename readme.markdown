# json-scrape

Scrape json from messy input streams.

[![build status](https://secure.travis-ci.org/substack/json-scrape.png)](http://travis-ci.org/substack/json-scrape)

# example

for a file with some json objects in it:

```
blip: { "type" : "test", "value" : 5 }

beep { "x" : 5, "y" : [5,6
,7,[8,9,10]] } boop

[1,2,3]

bloorp

letters: ["a",
"b","c",
"d","e"] fgh
```

this script:

``` js
var createScraper = require('json-scrape');

var scraper = createScraper();
scraper.on('data', function (obj) {
    console.dir(obj);
});

var fs = require('fs');
var s = fs.createReadStream(__dirname + '/data.txt');
s.pipe(scraper);
```

will pull out the json objects:

```
{ type: 'test', value: 5 }
{ x: 5, y: [ 5, 6, 7, [ 8, 9, 10 ] ] }
[ 1, 2, 3 ]
[ 'a', 'b', 'c', 'd', 'e' ]
```

Hooray!

# methods

``` js
var createScraper = require('json-scrape')
```

## var scraper = createScraper(opts)

Return a through stream that accepts messy data with embedded json and emits
the objects in `'data'` events.

# install

With [npm](http://npmjs.org) do:

```
npm install json-scrape
```

# license

MIT
