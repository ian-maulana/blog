import { Mongoose } from 'mongoose';

import { MONGO_URI } from '@utils/environment';
import logger from '@utils/logger';

const mongoose = new Mongoose();
mongoose.Promise = Promise;

const config: string = MONGO_URI;
mongoose.set('debug', (collectionName, method, query, doc) => {
  logger.debug(`${collectionName}.${method}`, JSON.stringify(query), doc);
});

mongoose
  .connect(config, {
    autoIndex: true,
    dbName: 'blog',
  })
  .then(() => logger.info('connection successful'))
  .catch(error => {
    logger.error(error);
    process.exit(1);
  });

export default mongoose;
