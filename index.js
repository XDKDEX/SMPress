const http = require('http');
const url = require('url');


function smpress() {
    class SMPress {
        constructor() {
            this.pathMapping = {}
            this.port = 80;
            this.routes = {GET: {},POST: {},PUT: {},DELETE: {},ALL: {}};

            return this;
        }
        bind(port) {
            if (typeof port !== 'number' || port < 1 || port > 65565) {
                throw new Error('Port must be a number between 1 and 65565');
            }
            this.port = port;
            return this;
        }
        create() {
            http.createServer((request, response) => {
                let urlDictionary = url.parse(request.url);
                if (urlDictionary.pathname in this.pathMapping) {
                    let req = {};
                    let res = {};
                    // console.log(request);
                    // console.log(response);
                    req.cookie = this.parseCookie(request.headers.cookie);
                    // req.query = function () { return query(urlDictionary.query || '') }
                    res.send = function (resource) { response.write(resource) } // temporary solution
                    res.end = function () { response.end() } // temporary solution
                    this.pathMapping[urlDictionary.pathname](req, res);
                    
                } else {
                    response.writeHead(404);
                    response.end()
                }
            }).listen(this.port);
            return this;
        }
        get(path, func) {
            this.pathMapping[path] = func
            console.log(this.pathMapping);
            return this;
        }
        parseCookie(string){
            if (!string) return {};
            let result = {};
            let cookieDictionary = string.split(';') // => ['a=b','b=c']
            let invalidIndex = 0;
            for (let index = 0; index < cookieDictionary.length; index++) {
                if(cookieDictionary[index].indexOf('=')==0){
                    result['__invalid_'+invalidIndex] = cookieDictionary[index].substr(1)
                    invalidIndex++;
                continue;
                }
                result[cookieDictionary[index].split("=")[0]] = cookieDictionary[index].split("=")[1]||''
            }
            return result;
            /*
                "a="    → {a: ''}        // 空值正确表示
                "a=b"   → {a: 'b'}       // 标准键值对
                "=c"    → {__invalid_0: 'c'} // 无效cookie的特殊处理
            */
        }
    }
    return new SMPress();
}

module.exports = {
    smpress
}