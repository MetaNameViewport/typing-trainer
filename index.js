import { createServer } from "http";
import { createReadStream, access, constants, readFileSync } from "fs";
import { join } from "path";
import choice from "./funcs.js";

const hostname = '127.0.0.1', port = 5500, protocol = 'http'
const base = `${protocol}://${hostname}:${port}`

const words = readFileSync(join('words.txt')).toString().split('\r\n');

const server = createServer((request, response) => {
    let url = new URL(base + request.url);
    let method = request.method;

    if (url.pathname == '/' && method == 'GET') {
        let path = join('static', 'index.html');

        access(path, constants.R_OK, (error) => {
            if (error) {
                console.error(error);
                return;
            }

            createReadStream(path).pipe(response)
        })
    }

    if (url.pathname == '/api/text' && method == 'GET') {
        let len = url.searchParams.get('length') || 50;

        response.end(choice(words, len).join(' '));
        //response.end(JSON.stringify(choice(words, len)))
    }
    
    if (url.pathname.split('/')[1] == 'static' && method == 'GET') {
        let path = join(...url.pathname.split('/'));

        access(path, constants.R_OK, (error) => {
            if (error) {
                console.error(error);
                return;
            }

            createReadStream(path).pipe(response)
        })
    }
})

server.listen(port, hostname, (error) => {
    if (error) {
        console.error(error)
        return;
    }

    console.log(`Server running at ${base}`)
})
