const http = require('http');
const url = require('url');

const option = {};
const pathMapping = {}

function smpress(params) {
    class sompress {
        constructor() {
            this.port = 80;
        }
        bind(port) {
            this.port = port;
        }
        create(func) {
            http.createServer((request, response) => {
                let pathname = url.parse(request.url).pathname;
                if (pathname in pathMapping) {
                    pathMapping[pathname](request, response);
                    response.end()
                } else {
                    response.writeHead(404);
                    response.end()
                }
            }).listen(this.port);
            console.log(this);
        }
        get(path, func) {
            pathMapping[path] = func
            console.log(pathMapping);
        }
    }
    return new smpress();
}
module.exports = {
    smpress
}