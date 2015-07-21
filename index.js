var through = require('through2');
var Parser = require('jsonparse');

module.exports = function (opts) {
    if (!opts) opts = {};
    
    var parser, value, pos;
    function createParser () {
        parser = new Parser;
        var alive = true;
        
        parser.onValue = function () {
            if (!alive) return;
            if (this.value !== undefined) {
                if (value !== undefined && value !== this.value
                && this.stack.length === 1
                && this.value[this.key] !== value) {
                    stream.push(value);
                    value = undefined;
                }
                value = this.value;
            }
        };
        parser.onError = function () {};
        
        parser.charError = function (buf, i) {
            if (!alive) return;
            alive = false;
            if (pos === undefined) {
                pos = i;
                if (value !== undefined) {
                    stream.push(value);
                    value = undefined;
                }
            }
        };
    }
    
    function write (buf, enc, next) {
        if (parser) {
            parser.write(buf);
            if (pos !== undefined) {
                parser = undefined;
                var pos_ = pos;
                pos = undefined;
                return write(buf.slice(pos_, buf.length), enc, next);
            }
            return next();
        }
        
        var s;
        for (var i = 0; i < buf.length; i++) {
            if (typeof buf === 'string') {
                s = buf.charAt(i);
            }
            else {
                s = String.fromCharCode(buf[i]);
            }
            if (s === '[' || s === '{') {
                createParser();
                parser.write(buf.slice(i, buf.length));
                if (pos === undefined) break;
                i += pos;
                
                pos = undefined;
                parser = undefined;
            }
        }
        next();
    }
    
    function end (next) {
        if (value !== undefined) {
            this.push(value);
        }
        next();
    }
    
    var stream = through({ readableObjectMode: true }, write, end);
    return stream;
};
