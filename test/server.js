const WebSocket = require('ws');
const jrpc = require('../dist/jrpc').default;

const wss = new WebSocket.Server({ port: 4000 });

var rpc = jrpc(wss,{});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});