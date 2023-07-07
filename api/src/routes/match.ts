import express, {Request, Response} from "express";
import { requireAuth } from "../middlewares/require-auth";
import { currentuser } from "../middlewares/current-user";
import { Team } from "../models/team";
import { Match } from "../models/match";
import mongoose from "mongoose";
import { Inning } from "../models/inning";

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
    const matches = await Match.find({ isDeleted: false }).populate('teams', 'name').exec();
    res.status(200).send(matches);
});

router.get('/live', async (req: Request, res: Response) => {
    const matches = await Match.find({ isDeleted: false, isLive: true }).populate('teams', 'name').exec();
    res.status(200).send(matches);
});

router.get('/:matchId', currentuser, requireAuth, async (req: Request, res: Response) => {
    const { matchId } = req.params;
    const match = await Match.findById(matchId).populate('teams').exec();
    
    res.status(200).send(match);
});

router.post('/:matchId/toss', currentuser, requireAuth, async (req: Request, res: Response) => {
    const { matchId } = req.params;
    const { winningTeamName,  winningTeamId, isBatFirst, otherTeamId } = req.body;

    const match = await Match.findById(matchId).populate('teams').exec();
    if (match) {
        // update toss info
        match.toss = {name: winningTeamName, id: winningTeamId, isBatFirst: isBatFirst};

        const tossWinningTeam = await Team.findById(winningTeamId).exec();
        const otherTeam = await Team.findById(otherTeamId).exec();

        let batFirst = null;
        let batSecond = null;

        if (isBatFirst) {
            batFirst = tossWinningTeam;
            batSecond = otherTeam;
        } else {
            batFirst = otherTeam;
            batSecond = tossWinningTeam;
        }

        
        //create first innings
        const firstInning = new Inning({
            batting: batFirst,
            bowling: batSecond,
        });

        await firstInning.save();

        //create second innings
        const secondInning = new Inning({
            batting: batSecond,
            bowling: batFirst,
        });

        await secondInning.save();

        match.firstInning = firstInning;
        match.secondInning = secondInning;
        match.status = "tossed";

        await match.save();
    }
    
    res.status(200).send(match);
});

router.get('/:matchId/firstInning/start', currentuser, requireAuth, async (req: Request, res: Response) => {
    const { matchId } = req.params;

    const match = await Match.findById(matchId).exec();
    if (match) {
        match.status="first_inning_started";
        match.isLive = true;
        await match.save();
    }
    
    res.status(200).send(match);
});

router.get('/:matchId/firstInning/end', currentuser, requireAuth, async (req: Request, res: Response) => {
    const { matchId } = req.params;

    const match = await Match.findById(matchId).exec();
    if (match) {
        match.status="first_inning_ended";
        match.isLive = false;
        await match.save();
    }
    
    res.status(200).send(match);
});

router.get('/:matchId/secondInning/start', currentuser, requireAuth, async (req: Request, res: Response) => {
    const { matchId } = req.params;

    const match = await Match.findById(matchId).exec();
    if (match) {
        match.status="second_inning_started";
        match.isLive = true;
        await match.save();
    }
    
    res.status(200).send(match);
});

router.get('/:matchId/secondInning/end', currentuser, requireAuth, async (req: Request, res: Response) => {
    const { matchId } = req.params;

    const match = await Match.findById(matchId).exec();
    if (match) {
        match.status="second_inning_ended";
        match.isLive = false;
        await match.save();
    }
    
    res.status(200).send(match);
});

export {router as matchRouter};