import express from "express";
import { json } from 'body-parser';

import { userRouter } from './user';
import { adminRouter } from './admin';
import { teamsRouter } from "./teams";

const app = express();
app.use(json());

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/teams', teamsRouter);

export {app as appRoutes};