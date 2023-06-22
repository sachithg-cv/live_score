import { Server } from "socket.io";

class SocketServer {
    private io: any;

    constructor() {

    }

    initServer = (httpServer:any, validDomains: Array<string> = []) => {
        this.io = new Server(httpServer, {
            cors: {
                origin: validDomains
            }
        });
    }

    createNameSpace = (name:string) => {
        return this.io.of(`/${name}`);
    }
}

const server = new SocketServer();

export default server;
