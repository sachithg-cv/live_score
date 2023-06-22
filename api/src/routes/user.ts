import express from "express";
import testNameSpace from '../messaging/namespace/test-name-space';

const router = express.Router();

router.get('/greetuser', (req, res) => {
    testNameSpace.getNameSpace().to("room1").emit("greet", {message: 'Hello User'});
    res.send("Hello user");
});

export {router as userRouter};