import { Socket } from "socket.io";

abstract class BaseNameSpace {
    ns:any;

    abstract initNameSpace(ns: any): void;

    public getNameSpace = () => {
        return this.ns;
    }
}

export default BaseNameSpace;