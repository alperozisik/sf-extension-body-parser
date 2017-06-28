# Smartface Extension for Body Parser Equvalent #

[body-parser](https://www.npmjs.com/package/body-parser) is a populer node module for parsing requests from the server side.
This module follows the similar dicipline to parse the body of the response from the server as a client.

## Install ##
```sh
npm i -S https://github.com/alperozisik/sf-extension-body-parser.git
```

## Usage ##
```javascript
const bodyParserRequest = require('sf-extension-body-parser');
```
Similar to the [body-parser](https://www.npmjs.com/package/body-parser) you need to:
1. Create parser
2. Add the parser to the parsing list
3. Perform the request

```javascript
var jsonParser = bodyParserRequest.json();
bodyParserRequest.addParser(jsonParser);
```
For the other usage of the parsers please refer to the [body-parser](https://www.npmjs.com/package/body-parser) documentation.

Only followint 3 parsers are supported:
- json
- text
- urlencoded


To perform the request, which handles the http.request for you, call the request method
```javascript
bodyParserRequest.request({
    url: "https://sf-extension-body-parser-alperozisik.c9users.io/",
    method: "POST"
}, function(err, res) {
    if(err) {
        // handle request failure here
    }
    //use res.body --> is a javascript object
    //use res.headers --> key-value list
    //use res.statusCode --> http statusCode
});
```






