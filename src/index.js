import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './сontact/index.js';

dotenv.config();

const startApp = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

startApp();
