const WebSocket = require('ws');
const Server = require('../dist/jrpc').Server;

// const wss = new WebSocket.Server({ port: 4000 });

var server = new Server();
server.open();
// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });

//   ws.send('something');
// });