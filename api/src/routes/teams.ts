import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { currentuser } from "../middlewares/current-user";
import { Team } from "../models/team";

const router = express.Router();

router.post('/', currentuser, requireAuth, async (req: Request, res: Response) => {
    try {
        const { name, players } = req.body;
        const team = new Team({
            name,
            players
        });
        await team.save();

        res.status(201).send(team);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error' });
    }
});

router.get('/', currentuser, requireAuth, async (req: Request, res: Response) => {
    try {
        const teams = await Team.find({ isDeleted: false }).exec();
        res.status(200).send(teams);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error' });
    }
});

router.get('/:teamId', currentuser, requireAuth, async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findById(teamId).exec();
        res.status(200).send(team);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'internal server error' });
    }
});

export { router as teamsRouter };