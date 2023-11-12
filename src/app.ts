import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ErrorResponse } from './types/responses';
import errorHandler from './middlewares/errorHandler';
import { generateApiKey } from './services/apiService';
import userRouter from './routes/user';

dotenv.config();

const port = process.env.PORT;
const app: Express = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// console.log(generateApiKey());

app.use('/user', userRouter);

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
