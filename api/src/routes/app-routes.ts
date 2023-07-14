import express from "express";
import { json } from 'body-parser';

import { userRouter } from './user';
import { adminRouter } from './admin';
import { teamsRouter } from "./teams";
import { matchRouter } from "./match";
import { inningRouter } from "./inning";
import { utilRouter } from "./util";

const app = express();
app.use(json());

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/teams', teamsRouter);
app.use('/matches', matchRouter);
app.use('/innings', inningRouter);
app.use('/util', utilRouter )

export {app as appRoutes};