import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ErrorResponse } from './types/responses';
import errorHandler from './middlewares/errorHandler';
import userRouter from './routes/user';
import employeeRouter from './routes/employee';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import incomingLetterRouter from './routes/incomingLetter';
import outgoingLetterRouter from './routes/outgoingLetter';
import dispositionRouter from './routes/disposisiton';
import instructionRouter from './routes/instruction';
import positionRouter from './routes/position';
import sectionRouter from './routes/section';
import statusRouter from './routes/status';
import userLevelRouter from './routes/userLevel';

dotenv.config();

const port = process.env.PORT;
const app: Express = express();

// middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());

// routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/employees', employeeRouter);
app.use('/incoming_letters', incomingLetterRouter);
app.use('/outgoing_letters', outgoingLetterRouter);
app.use('/dispositions', dispositionRouter);
app.use('/istructions', instructionRouter);
app.use('/positions', positionRouter);
app.use('/sections', sectionRouter);
app.use('/status', statusRouter);
app.use('/user_levels', userLevelRouter);

// error handler
app.get('*', (req, res, next) => {
  const err: ErrorResponse = {
    status: 404,
    message: '404 NOT FOUND',
  };
  next(err);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`REST API listening on port ${port}`);
});
