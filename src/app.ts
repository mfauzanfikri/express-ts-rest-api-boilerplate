import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import Route from './routes/Route';
import cors from 'cors';
import { RequestError } from './types/RequestError';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const port = process.env.PORT;
const app: Express = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/example', Route);

app.get('*', (req, res, next) => {
  const err: RequestError = {
    status: 404,
    message: '404 NOT FOUND',
  };
  next(err);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`REST API listening on port ${port}`);
});
