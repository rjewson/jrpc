# jrpc

An amusingly small JS RPC solution.

```js
import Client from 'Client.js';

var client = new Client('ws://localhost:4000');
(async () => {
  await client.open();
  await client.whatsUp();
  await client.foobar("this", "is", "a", "test");
})();
```

Todo: Finish server.  Use decrators to define access on server?