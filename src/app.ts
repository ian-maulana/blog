import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userv1 from './routes/v1/user';
import onboardV1 from './routes/v1/onboard';
import morganLogger from './utils/morgan_logger';
import errorCatch from './utils/error_catch';
import ErrorMapper from './utils/error_mapper';

const app = express();

app.use(morganLogger);
app.use(
  cors({
    origin: ['*'],
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user', userv1);
app.use('/api/v1/onboard', onboardV1);

// handling 404 not found
app.use((_req, _res, next) => {
  return next(new ErrorMapper('Resource not found', 404));
});

app.use(errorCatch);

export default app;
