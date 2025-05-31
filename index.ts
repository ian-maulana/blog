import 'dotenv/config';

import { PORT } from '@utils/environment';
import logger from '@utils/logger';

import app from '@app';

async function main() {
  app.listen(PORT, async () => {
    logger.info(`Server is running at http://localhost:${PORT}`);
  });
}

main();
