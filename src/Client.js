import { encode, decode } from "./Command.js";
import rpcProxy from "./RPCProxy.js";

export default class Client {
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
