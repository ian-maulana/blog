import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import onboardV1 from '@routes/v1/onboard';
import userv1 from '@routes/v1/user';

import errorCatch from '@utils/error_catch';
import ErrorParser from '@utils/error_parser';
import morganLogger from '@utils/morgan_logger';

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
  return next(new ErrorParser('Resource not found', 404));
});

app.use(errorCatch);

export default app;
