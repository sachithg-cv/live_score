import express from "express";
import { json } from 'body-parser';

import { userRouter } from './user';
import { adminRouter } from './admin';

const app = express();
app.use(json());

app.use('/user', userRouter);
app.use('/admin', adminRouter);

export {app as appRoutes};