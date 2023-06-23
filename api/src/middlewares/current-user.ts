import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    email: string;
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            currentuser?:UserPayload;
        }
    }
}

export const currentuser = (req: Request, res: Response, next: NextFunction) => {
    if(!req.session?.jwt) {
        return next();
    }

    try {
        const payload = (jwt.verify(req.session.jwt, "test#123")) as UserPayload;
        req.currentuser = payload;
    } catch(err) {
        console.error(err);
    }

    next();
};
