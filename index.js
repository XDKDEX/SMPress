const http = require('http');
const url = require('url');


function smpress() {
    class SMPress {
        constructor() {
            this.pathMapping = {}
            this.port = 80;
            this.routes = {
                GET: {},
                POST: {},
                PUT: {},
                DELETE: {},
                ALL: {}
            };

        }
        bind(port) {
            if (typeof port !== 'number' || port < 1 || port > 65565) {
                throw new Error('Port must be a number between 1 and 65565');
            }
            this.port = port;
        }
        create() {
            http.createServer((request, response) => {
                let urlDictionary = url.parse(request.url);
                if (urlDictionary.pathname in this.pathMapping) {
                    let req = {};
                    let res = {};
                    req.query = function () { return query(urlDictionary.query || '') }
                    res.send = function (resource) { response.write(resource) } //临时
                    res.end = function () { response.end() } //临时
                    this.pathMapping[urlDictionary.pathname](req, res);
                    
                } else {
                    response.writeHead(404);
                    response.end()
                }
            }).listen(this.port);
        }
        get(path, func) {
            this.pathMapping[path] = func
            console.log(this.pathMapping);
        }
    }
    return new SMPress();
}
function query(string) {
    if(string == '') return null;
    let result = {};
    string = string.split("&");
    for (let i = 0; i < string.length; i++) {
        let tmp = string[i].split("=");
        for (let j = 0; j < tmp.length; j++) {
            result[tmp[0]] = tmp[1]
        }
    }
    return result;
}

module.exports = {
    smpress
}