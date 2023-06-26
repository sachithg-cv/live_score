import express, {Request, Response} from "express";
import testNameSpace from '../messaging/namespace/test-name-space';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { Password } from "../services/password";
import { currentuser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

router.get('/greetuser', (req, res) => {
    testNameSpace.getNameSpace().to("room1").emit("greet", {message: 'Hello User'});
    res.send("Hello user");
});

router.post('/signup', async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        return res.status(400).send({message:'Email is already in use'});
    }
    const user = User.build({email, password});
    await user.save();

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    },'test#123');

    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
});

router.post('/signin', async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({ email });
    if(!existingUser) {
        return res.status(401).send({message:'Invalid credentials'});
    }

    const passwordMatch = await Password.compare(existingUser.password, password);
    if(!passwordMatch) {
        return res.status(401).send({message:'Invalid credentials'});
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },'test#123');

    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser);
});

router.get('/currentuser', currentuser, requireAuth, (req: Request, res: Response) => {
    return res.send({currentuser: req.currentuser || null});
});

router.post('/signout', (req: Request, res: Response) => {
    req.session = null;
    res.send({});
});

export {router as userRouter};
