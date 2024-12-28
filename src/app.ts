import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import user from './routes/user';

const app = express();

app.use(
  cors({
    origin: ['*'],
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v1/user', user);

export default app;
