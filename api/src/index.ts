import express from 'express';
import { createServer } from "http";
import { json } from 'body-parser';
import mongoose from 'mongoose';
import { appRoutes } from './routes/app-routes';
import socketServer from './messaging/server';
import testNameSpace from './messaging/namespace/test-name-space';
import cookieSession from 'cookie-session';

const root = express();
root.use(json());
root.use(cookieSession({
    signed: false
}));

root.use("/api/v1", appRoutes);

const httpServer = createServer(root);

// init socket server
socketServer.initServer(httpServer,["http://localhost:4200"]);

// create namespaces
testNameSpace.initNameSpace(socketServer.createNameSpace("test"));

const start = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27018/live-score", {
            auth: {
                username: 'root',
                password: 'root'
            },
            authSource:"admin"
        });
    } catch (err) {
        console.error(err);
    }
    httpServer.listen(3000);
}

start();