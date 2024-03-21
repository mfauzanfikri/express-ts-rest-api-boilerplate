import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import Route from './routes/main.route';
import cors from 'cors';
import { ErrorResponse } from './types/response.type';

dotenv.config();

const port = process.env.PORT;
const app: Express = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/example', Route);

app.get('*', (_, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Not found',
  });
});

app.listen(port, () => {
  console.log(`REST API listening on port ${port}`);
});
