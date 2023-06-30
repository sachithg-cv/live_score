import express, {Request, Response} from "express";
import { requireAuth } from "../middlewares/require-auth";
import { currentuser } from "../middlewares/current-user";
import { Team } from "../models/team";

const router = express.Router();

router.post('/', currentuser, requireAuth, async (req: Request, res: Response) => {
    const {name, players}  = req.body;
    const team = new Team({
        name,
        players
    });
    await team.save();
    
    res.status(201).send(team);
});

export {router as teamsRouter};