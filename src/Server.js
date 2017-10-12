import WebSocket from "ws";
import { encode, decode } from "./Command";

// const RPC = (taget, key, descriptor) => {
//   target.remoteCalls = key;
//   console.log("hi");
//   return descriptor;
// }

export default class Server {
  constructor() {
    this.remoteCalls = new Map();
  }
  open() {
    return new Promise(resolve => {
      this.wss = new WebSocket.Server(
        {
          port: 4000
        },
        () => resolve(this)
      );
      this.wss.on("connection", ws => {
        console.log("connected");
        ws.on("message", data => {
          const request = decode(data);
          console.log(request);
          const { id } = request;
          ws.send(encode({ id, result: "ok" }));
        });
      });
    });
  }

  // @RPC
  // myMethod() {

  // }

}
