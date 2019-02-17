const http = require('http');
const https = require('https');
const app = require('./app');

const port = process.env.PORT || 3700;

const http_server = http.createServer(app);

const https_server = https.createServer(app);

http_server.listen(port+10);
https_server.listen(port);