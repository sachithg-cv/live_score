import BaseNameSpace from "./base-name-space";

class GlobalNameSpace extends BaseNameSpace{

    initNameSpace = (ns:any) => {
        this.ns = ns;

        this.ns.use((socket: any, next: any) => {
            let query = socket.handshake.query;
        
            if (!query) {
                return next(new Error('invalid request'));
            }
        
            const { roomId } = query;
            socket.roomId = roomId;
            next();
        });

        this.ns.on("connection", (socket: any) => {
            const roomId = socket.roomId;
            socket.join(roomId);
            //this.ns.to(roomId).emit("live", {message: `User added to the ${roomId}`});
            this.publishMessage(roomId, "dashboard", {message: `User added to the ${roomId}`})
        });
    }

    publishMessage = (room:string, event:string, message:any) => {
        this.ns.to(room).emit(event, message);
    }

}

const ns = new GlobalNameSpace();
export default ns;
