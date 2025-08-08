const http = require("node:http");

const server = http.createServer((req, res) => {
    if (req.url === "/getData") {
        res.end("There is no data");
    } else {
        res.end("Hello world!");
    }
});

server.listen(8888);