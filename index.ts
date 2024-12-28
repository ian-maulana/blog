import 'dotenv/config';
import app from './src/app';
import logger from './src/utils/logger';
import { PORT } from './src/utils/constant';

async function main() {
  app.listen(PORT, async () => {
    logger.info(`App is running at http://localhost:${PORT}`);
  });
}

main();
