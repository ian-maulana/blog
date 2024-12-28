import app from './src/app';
// import * as database from "./infrastructure/database";
import logger from './src/utils/logger';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  // await database.connect();
  const port = process.env.port || 3000;
  app.listen(port, async () => {
    logger.info(`App is running at http://localhost:${port}`);
  });
}

main();
