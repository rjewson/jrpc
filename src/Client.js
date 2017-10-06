import { encode, decode } from "./Command.js";

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

export default class Client {
  constructor(url) {
    this.url = url;
    this.proxy = new Proxy(this, {
      get: function(target, name, receiver) {
        const targetProp = target[name];
        if (targetProp) {
          return targetProp.bind(target);
        } else {
          return (...args) => target.sendRemoteCall(name, ...args);
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
