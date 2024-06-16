import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import router from './routers/contacts.js';
import { env } from './utils/env.js';
import { ENV_VARS } from './сontact/index.js';
import createHttpError from 'http-errors';
import { deleteContactByIdService } from './services/contacts.js';
import { getContactByIdController } from './controllers/contacts.js';

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

  const notFoundHandler = (req, res, next) => {
    next(createHttpError(404, 'Route not found'));
  };

  const errorHandler = (err, req, res, next) => {
    if (err.name === 'CastError') {
      res.status(400).json({
        status: 400,
        message: 'Bad Request',
        data: {
          message: `Invalid ${err.path}: ${err.value}`,
        },
      });
    } else {
      res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Server error',
        data: err.data || {},
      });
    }
  };

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.get('/contacts/:contactId', getContactByIdController);
  app.delete('/contacts/:contactId', deleteContactByIdService);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
