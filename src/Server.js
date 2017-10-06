import WebSocket from "ws";
import { encode, decode } from "./Command";

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
          const request = decode(data);
          console.log(request);
          const { id } = request;
          ws.send(encode({ id, result: "ok" }));
        });
      });
    });
  }
}
