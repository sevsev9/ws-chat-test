import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import {Message} from "./Message";
import {Connection} from "./Connection";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const messages = new Array<Message>();
const connections = new Array<Connection>();

app.get('/', (req, res) => {
    res.status(200);
    res.send(messages);
    res.end();
})

wss.on('connection', (ws: WebSocket) => {
    // @ts-ignore
    console.log(`New connection: ${ws._socket.remoteAddress}`);
    let name = "";

    ws.on('message', (event: string) => {
        const message:any = JSON.parse(event);

        console.log(`name: ${message.name} | msg: ${message.message}`)

        if (message.init) {
            if (message.name) {
                if (connections.filter(e => e.name === message.name).length > 0) {
                    ws.send(JSON.stringify({
                        accept: false,
                        err: '[Error] Name already taken.'
                    }));
                } else {
                    name = message.name;
                    connections.push(new Connection(message.name, ws));
                    ws.send(JSON.stringify({
                      accept: true
                    }))
                }
            } else {
                ws.send(JSON.stringify({
                    accept: false,
                    err: '[Error] Init packet without name received.'
                }));
            }
        } else {
            message.timestamp = Date.now();
            messages.push(message);
            connections.forEach(conn => conn.ws.send(JSON.stringify(message)));
        }
    });

    ws.on('close', () => {
        console.log(`closing event from '${name}' ${connections.length}`);
        connections.splice(connections.indexOf(connections.filter(e => e.name === name)[0]), 1);
    })
})

server.listen(process.env.PORT || 8000, () => {
    // @ts-ignore
    console.log(`Server running on port ${server.address().port}`)
})
