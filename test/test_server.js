const WebSocket = require('ws');
const Server = require('../dist/jrpc').Server;

var server = new Server();
server.open();
// server.myMethod();
