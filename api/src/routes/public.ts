import express from "express";
import { Match } from "../models/match";

const router = express.Router();

router.get('/matches', async (req, res) => {
    const matches = await Match.find({ isDeleted: false },'teams status isLive').populate('teams', 'name').exec();
    res.status(200).send(matches);
});

export {router as publicRouter};