const http = require('http');
const url = require('url');

const pathMapping = {}

function smpress(params) {
    class smpress {
        constructor() {
            this.port = 80;
        }
        bind(port) {
            this.port = port;
        }
        create() {
            http.createServer((request, response) => {
                let pathname = url.parse(request.url).pathname;
                if (pathname in pathMapping) {
                    let req = {};
                    let res = {};
                    req.query = function () {return query(request.url)}
                    pathMapping[pathname](req, res);
                    response.end()
                } else {
                    response.writeHead(404);
                    response.end()
                }
            }).listen(this.port);
        }
        get(path, func) {
            pathMapping[path] = func
            console.log(pathMapping);
        }
    }
    return new smpress();
}
function query(string) {
    let result = {};
    if (string.indexOf("=") == -1 && string.indexOf("&") == -1) { return null }
    if (string.indexOf("&") == -1) {
        let tmp = string.split("=");
        result[tmp[0]] = tmp[1]
    } else {
        string = string.split("&");
        for (let i = 0; i < string.length; i++) {
            let tmp = string[i].split("=");
            for (let j = 0; j < tmp.length; j++) {
                result[tmp[0]] = tmp[1]
            }
        }
    }
    return result;
}

module.exports = {
    smpress
}