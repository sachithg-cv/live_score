import express from "express";
import { Global } from "../models/global";

const router = express.Router();

router.get('/globals', async (req, res) => {
    const global = await Global.find({isDeleted:false});
    res.status(200).send(global);
});

export {router as utilRouter };