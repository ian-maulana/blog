import { Mongoose } from 'mongoose';
import logger from '../utils/logger';
import { MONGO_URI } from '../utils/constant';

const mongoose = new Mongoose();
mongoose.Promise = Promise;

const config: string = MONGO_URI;
mongoose.set('debug', (collectionName, method, query, doc) => {
  logger.info(`${collectionName}.${method}`, JSON.stringify(query), doc);
});

mongoose
  .connect(config, { autoIndex: true, dbName: 'coret' })
  .then(() => logger.info('connection successful'))
  .catch(error => {
    logger.info(error);
    process.exit(1);
  });

export default mongoose;
