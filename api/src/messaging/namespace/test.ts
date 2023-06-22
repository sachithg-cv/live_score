import { Server, Socket } from "socket.io";

export const createTestNamespace = (io: Server) => {
    const testNamespace = io.of("/test");

    testNamespace.on("connection", (socket: Socket) => {
        socket.join("room1");
        testNamespace.to("room1").emit("greet", {message: 'User added to the room1'});
    });

    return testNamespace;
};