import { decode, encode } from "./Command.js";

/*
  RPC Format Spec:

  Call = 
  {
    id: 0,
    method: "methondName",
    args: []
  }

  Result = 
  {
    id: 0,
    result: *
  }
*/

export const open = Symbol();
const props = Symbol();
const createRemoteCall = Symbol();
const sendRemoteCall = Symbol();

export default class Client {
  constructor(url) {
    this[props] = {
      url,
      ws : null,
      remoteCalls: new Map()
    };
    return new Proxy(this, {
      get: function (target, name, receiver) {
        const targetProp = target[name];
        if (targetProp) {
          return targetProp.bind(target);
        } else {
          return (...args) => target[sendRemoteCall](name, ...args);
        }
      }
    });
  }

  [open]() {
    return new Promise((resolve, reject) => {
      let ws = this[props].ws = new WebSocket(this[props].url);
      ws.binaryType = "arraybuffer";
      ws.onopen = event => {
        resolve(this);
      };
      ws.onerror = event => {
        reject();
      };
      ws.onclose = event => {
        console.log("closed");
      };
      ws.onmessage = event => {
        const { id, result } = decode(event.data);
        this[props].remoteCalls.get(id).resolve(result);
      };
    });
  }

  // Return a Defered/Promise 
  [createRemoteCall](id) {
    let _resolve = null;
    let _reject = null;
    let remotePromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    remotePromise.resolve = (...args) => _resolve(...args);
    remotePromise.reject = (...args) => _reject(...args);
    this[props].remoteCalls.set(id, remotePromise);
    return remotePromise;
  }

  // Send the RPC and return the defered...
  [sendRemoteCall](method, ...args) {
    const id = Math.random().toString();
    this[props].ws.send(encode({ id, method, args }));
    return this[createRemoteCall](id);
  }
}
