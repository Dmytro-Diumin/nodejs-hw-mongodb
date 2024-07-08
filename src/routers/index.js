import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/contacts', contactsRouter);

export default rootRouter;
