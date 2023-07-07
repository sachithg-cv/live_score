import BaseNameSpace from "./base-name-space";

class MatchNameSpace extends BaseNameSpace{

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
            this.ns.to(roomId).emit("live", {message: `User added to the ${roomId}`});
        });
    }

}

const ns = new MatchNameSpace();
export default ns;
