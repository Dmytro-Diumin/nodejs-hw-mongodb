import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { router } from './routes/contacts.js';
import { env } from './utils/env.js';
import { ENV_VARS } from './сontact/index.js';

dotenv.config();
const PORT = env(ENV_VARS.PORT, 3000);

export const setupServer = () => {
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/contacts', router);

  app.use((req, res) => {
    res.status(404).json({
      status: '404',
      message: 'Not found',
      data: null,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
