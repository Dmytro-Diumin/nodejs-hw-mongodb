import express from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const rootRouter = express.Router();
const jsonParser = express.json();

rootRouter.use('/auth', jsonParser, authRouter);
rootRouter.use('/contacts', jsonParser, contactsRouter);

export default rootRouter;
