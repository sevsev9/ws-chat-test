import { WebSocket } from "ws";

export class Connection {
    name: string;
    ws: WebSocket;

    constructor(name: string, ws: WebSocket) {
        this.name = name;
        this.ws = ws;
    }
}
