import WebSocket from "ws";
import {encode, decode} from "./Command";

export default class Server {
  constructor() {}
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
          console.log(decode(data));
          ws.send( encode({ data: "ping" }));
        });
      });
    });
  }
}
