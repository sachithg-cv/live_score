import express from "express";
import { Global } from "../models/global";

const router = express.Router();

router.get('/globals', async (req, res) => {
    try {
        const global = await Global.find({ isDeleted: false });
        res.status(200).send(global);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error' });
    }
});

export { router as utilRouter };