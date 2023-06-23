import express, {Request, Response} from "express";
import testNameSpace from '../messaging/namespace/test-name-space';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { Password } from "../services/password";

const router = express.Router();

router.get('/greetuser', (req, res) => {
    testNameSpace.getNameSpace().to("room1").emit("greet", {message: 'Hello User'});
    res.send("Hello user");
});

router.post('/signup', async (req: Request, res: Response) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        return res.send({message:'Email is already in use'});
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
        return res.send({message:'Invalid credentials'});
    }

    const passwordMatch = await Password.compare(existingUser.password, password);
    if(!passwordMatch) {
        return res.send({message:'Invalid credentials'});
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

router.get('/currentuser', (req: Request, res: Response) => {
    if(!req.session?.jwt) {
        return res.send({currentuser: null});
    }

    try {
        const payload = jwt.verify(req.session.jwt, "test#123");
        return res.send({currentuser: payload});
    } catch(err) {
        return res.send({currentuser: null});
    }
});

export {router as userRouter};
