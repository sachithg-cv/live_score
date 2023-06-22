import { Socket } from "socket.io";
import BaseNameSpace from "./base-name-space";

class TestNameSpace extends BaseNameSpace{

    initNameSpace = (ns:any) => {
        this.ns = ns;
        this.ns.on("connection", (socket: Socket) => {
            socket.join("room1");
            this.ns.to("room1").emit("greet", {message: 'User added to the room1'});
        });
    }

}

const ns = new TestNameSpace();
export default ns;
