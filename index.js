import { createServer } from "http";
import { createReadStream, access, constants, readFileSync, fstat } from "fs";
import { join } from "path";
import choice from "./funcs.js";

const hostnameOut = '94.181.46.30'
const hostnameIn = '192.168.0.102', port = 80, protocol = 'http'
const base = `${protocol}://${hostnameIn}:${port}`

const words = readFileSync(join('words.txt')).toString()

const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
];

const server = createServer((request, response) => {
    let url = new URL(base + request.url);
    let method = request.method;
    
    // default path router
    if (url.pathname == '/' && method == 'GET') {     
        let deviceType;

        try { // я кер его знает че оно выеживается
            deviceType = toMatch.some((toMatchItem) => {
                return request.headers['user-agent'].match(toMatchItem);
            }) ? 'mobile' : 'desktop';
        } catch {
            deviceType = 'desktop'
        }

        let path = join('static', `${deviceType}` , `${deviceType}.html`);

        access(path, constants.R_OK, (error) => {
            if (error) {
                console.error(error);
                return;
            }

            createReadStream(path).pipe(response)
        })
    }
    
    // api router
    if (url.pathname == '/api/text' && method == 'GET') {
        let len = url.searchParams.get('length') || 50;
        response.end(JSON.stringify(choice(words, len)).replace(/"/g, ''))
    }

    // file router
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

server.listen(port, (error) => {
    if (error) {
        console.error(error)
        return;
    }

    console.log(`Server running at ${protocol}://${hostnameOut}:${port}`)
})
