import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { env } from '../utils/env.js';
import { MONGODB_VARS } from '../сontact/index.js';

dotenv.config();

export const initMongoConnection = async () => {
  try {
    const user = env(MONGODB_VARS.MONGODB_USER);
    const password = env(MONGODB_VARS.MONGODB_PASSWORD);
    const url = env(MONGODB_VARS.MONGODB_URL);
    const dbName = env(MONGODB_VARS.MONGODB_DB, '');

    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority`,
    );
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
