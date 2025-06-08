import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import channelv1 from '@routes/v1/channel';
import onboardv1 from '@routes/v1/onboard';
import productv1 from '@routes/v1/product';
import providerv1 from '@routes/v1/provider';
import transactionv1 from '@routes/v1/transaction';
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
app.use('/api/v1/onboard', onboardv1);
app.use('/api/v1/provider', providerv1);
app.use('/api/v1/channel', channelv1);
app.use('/api/v1/product', productv1);
app.use('/api/v1/transaction', transactionv1);

// handling 404 not found
app.use((_req, _res, next) => {
  return next(new ErrorParser('Resource not found', 404));
});

app.use(errorCatch);

export default app;
