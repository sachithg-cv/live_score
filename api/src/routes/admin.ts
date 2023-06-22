import express from "express";
import testNameSpace from "../messaging/namespace/test-name-space";

const router = express.Router();

router.get('/greetadmin', (req, res) => {
    testNameSpace.getNameSpace().to("room1").emit("greet", {message: 'Hello Admin'});
    res.send("Hello admin");
});

export {router as adminRouter};