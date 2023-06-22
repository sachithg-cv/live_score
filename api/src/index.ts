import express from 'express';
import { createServer } from "http";
import { json } from 'body-parser';

import { appRoutes } from './routes/app-routes';
import socketServer from './messaging/server';
import testNameSpace from './messaging/namespace/test-name-space';

const root = express();
root.use(json());

root.use("/api/v1", appRoutes);

const httpServer = createServer(root);

// init socket server
socketServer.initServer(httpServer,["http://localhost:4200"]);

// create namespaces
testNameSpace.initNameSpace(socketServer.createNameSpace("test"));

httpServer.listen(3000);