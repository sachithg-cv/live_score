import express from 'express';
import { createServer } from "http";
import { Server} from "socket.io";
import { json } from 'body-parser';
import { createTestNamespace } from './messaging/namespace/test';

export const app = express();
app.use(json());

const httpServer = createServer(app);

// create socket sever
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:4200"]
    }
});

const testNS = createTestNamespace(io);

app.get('/hello', (req, res) => {
    testNS.to("room1").emit("greet", {message: 'Hello User'});
    res.send('Hello world');
});

httpServer.listen(3000);