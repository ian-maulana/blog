import express from 'express';
// import user_routes from "../app/routes";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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

// user_routes(app);

export default app;
