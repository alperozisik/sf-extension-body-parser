const bodyParser = require("./body-parser");
const Http = require("sf-core/net/http");
const Buffer = require("./buffer").Buffer;
if (!global.window)
    global.window = global;
if (typeof global.document === "undefined")
    global.document = null;
if (typeof global.navigator === "undefined")
    global.navigator = null;

const parsers = [];

exports.request = request;

Object.defineProperties(exports, {
    json: {
        enumerable: true,
        configurable: true,
        value: bodyParser.json
    },
    text: {
        enumerable: true,
        configurable: true,
        value: bodyParser.text
    },
    urlencoded: {
        enumerable: true,
        configurable: true,
        value: bodyParser.urlencoded
    }
});

exports.addParser = addParser;


function request(options, callback) {
    var requestOptions = Object.create(options);
    if (!callback && options.callback)
        callback = options.callback;

    function onLoad(response) {
        var res = prepResponse(response);
        var handle = getHandler(res, {});
        handle();
    }

    function onError(response) {
        var res = prepResponse(response);
        var handle = getHandler(res, {});
        handle();
    }

    function prepResponse(response) {
        var b64string = "";
        var encoding = 'base64';
        if (response.body && response.body.size > 0) {
            // TODO: SUPDEV-423
            // b64string = response.body.toBase64();
            b64string = response.body.toString();
            encoding = "utf8";
        }
        var buf = Buffer.from(b64string, encoding);

        var dataEvent, endEvent;

        var res = {
            headers: response.headers,
            on: function(eventType, callback) {
                switch (eventType) {
                    case "data":
                        dataEvent = callback;
                        break;
                    case "end":
                        endEvent = callback;
                        break;
                }
                finalize();
            },
            removeListener: function() {},
            statusCode: response.statusCode
        };

        function finalize() {
            if (dataEvent && endEvent) {
                dataEvent(buf);
                endEvent();
            }
        }

        return res;
    }

    var localParsers = parsers.slice(0);
    if (callback) {
        localParsers.push(function(req, res, next) {
            if (req && !res) {
                return callback(req); //err
            }
            delete req.on;
            delete req.removeListener;
            return callback(null, req);
        });
    }

    function getHandler(req, res) {
        var n = handle;
        return handle;

        function handle(err) {
            var next = n;
            var fn = localParsers.shift();
            if (!fn)
                return;
            try {
                if (!err) {
                    fn(req, res, next);
                }
                else {
                    fn(err);
                }
            }
            catch (ex) {
                console.log("error");
                next(ex);
            }
        }
    }
    Http.request(requestOptions, onLoad, onError);
}


function addParser(parser) {
    if (!parsers)
        return;
    parsers.push(parser);
}
