import express, {Request, Response} from "express";
import { requireAuth } from "../middlewares/require-auth";
import { currentuser } from "../middlewares/current-user";
import { Team } from "../models/team";
import { Match } from "../models/match";
import mongoose from "mongoose";

const router = express.Router();

router.post('/', currentuser, requireAuth, async (req: Request, res: Response) => {
    const { teams }  = req.body;

    const team1 = await Team.findById(teams[0]).exec();
    const team2 = await Team.findById(teams[1]).exec();
    
    const match = new Match({
        roomId: new mongoose.Types.ObjectId().toHexString(),
        status:'scheduled',
    });

    match.teams.push(team1);
    match.teams.push(team2);

    await match.save();
    
    res.status(201).send(match);
});

router.get('/', currentuser, requireAuth, async (req: Request, res: Response) => {
    const matches = await Match.find({ isDeleted: false }).populate('teams').exec();
    res.status(200).send(matches);
});

router.get('/:matchId', currentuser, requireAuth, async (req: Request, res: Response) => {
    const { matchId } = req.params;
    const match = await Match.findById(matchId).populate('teams').exec();
    
    res.status(200).send(match);
});

export {router as matchRouter};