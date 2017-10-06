'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var WebSocket$1 = _interopDefault(require('ws'));

const encode = o => JSON.stringify(o);
const decode = o => JSON.parse(o);

/*
  {
    id: 0,
    method: "methondName",
    args: []
  }

  {
    id: 0,
    result: *
  }
*/

class Client {
  constructor(url) {
    this.url = url;
    this.proxy = new Proxy(this, {
      get: function(target, name, receiver) {
        const targetProp = target[name];
        // debugger;
        if (targetProp) {
          return targetProp.bind(target);
        } else {
          return (...args) => {
            // const [method, ...methodParams] = args;
            return target.sendRemoteCall(name, ...args);
            // return new Promise(resolve => {
            //   resolve("ok");
            // });
          };
        }
      }
    });
    this.remoteCalls = new Map();
    return this.proxy;
  }

  open() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.binaryType = "arraybuffer";
      this.ws.onopen = event => {
        resolve(this);
      };
      this.ws.onerror = event => {
        reject();
      };
      this.ws.onclose = event => {
        console.log("closed");
      };
      this.ws.onmessage = event => {
        const { id, result } = decode(event.data);
        this.remoteCalls.get(id).resolve(result);
      };
    });
  }

  createRemoteCall(id) {
    let _resolve = null;
    let _reject = null;
    let remotePromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    remotePromise.resolve = (...args) => _resolve(...args);
    remotePromise.reject = (...args) => _reject(...args);
    this.remoteCalls.set(id, remotePromise);
    return remotePromise;
  }

  sendRemoteCall(method, ...args) {
    const id = Math.random().toString();
    this.ws.send(encode({ id, method, args }));
    return this.createRemoteCall(id);
  }
}

class Server {
  constructor() {}
  open() {
    return new Promise(resolve => {
      this.wss = new WebSocket$1.Server(
        {
          port: 4000
        },
        () => resolve(this)
      );
      this.wss.on("connection", ws => {
        console.log("connected");
        ws.on("message", data => {
          const {id} = decode(data);
          ws.send( encode({ id, result:"ok" }));
        });
      });
    });
  }
}

exports.Client = Client;
exports.Server = Server;
