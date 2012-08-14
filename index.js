var through = require('through');
var Parser = require('jsonparse');

module.exports = function (opts) {
    if (!opts) opts = {};
    
    var parser, value, pos;
    function createParser () {
        parser = new Parser;
        
        parser.onValue = function () {
            if (this.value !== undefined) {
                if (value !== undefined && value !== this.value) {
                    //stream.emit('data', value);
                }
                value = this.value;
            }
        };
        parser.onError = function () {};
        
        parser.charError = function (buf, i) {
            if (pos === undefined) {
                pos = i;
                if (value !== undefined) {
                    stream.emit('data', value);
                    value = undefined;
                }
            }
        };
    }
    
    function write (buf) {
        if (parser) {
            parser.write(buf);
            if (pos !== undefined) {
                parser = undefined;
                var pos_ = pos;
                pos = undefined;
                write(buf.slice(pos_, buf.length));
            }
            return;
        }
        
        for (var i = 0; i < buf.length; i++) {
            var s = String.fromCharCode(buf[i]);
            if (s === '[' || s === '{') {
                createParser();
                parser.write(buf.slice(i, buf.length));
                if (pos === undefined) break;
                i += pos;
                
                pos = undefined;
                parser = undefined;
            }
        }
    }
    
    function end () {
        if (value !== undefined) {
            stream.emit('data', value);
        }
        stream.emit('end');
    }
    
    var stream = through(write, end);
    return stream;
};
