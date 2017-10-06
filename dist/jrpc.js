'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var WebSocket$1 = _interopDefault(require('ws'));

const encode = o => JSON.stringify(o);
const decode = o => JSON.parse(o);

var rpcProxy = (target) =>
  new Proxy(target, {
    get: function(target, name, receiver) {
      const targetProp = target[name];
      // debugger;
      if (targetProp) {
        return targetProp.bind(target);
      } else {
        return (...args) => {
          return new Promise(resolve => {
            resolve("ok");
          });
        };
      }
    }
  });

class Client {
  constructor(url) {
    this.url = url;
    this.proxy = rpcProxy(this);
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
    });
  }

  createRemoteCall(id) {
    let _resolve = null;
    let _reject = null;
    let remotePromise = new Promise( (resolve,reject) => {
      _resolve = resolve;
      _reject = reject;
    } );
    remotePromise.resolve = (...args) => _resolve(...args);
    remotePromise.reject = (...args) => _reject(...args);
    remoteCalls.set(id,remotePromise);
  }

  send() {
    debugger;
    this.ws.send(encode({ data: "ping" }));
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
          console.log(decode(data));
          ws.send( encode({ data: "ping" }));
        });
      });
    });
  }
}

exports.Client = Client;
exports.Server = Server;
