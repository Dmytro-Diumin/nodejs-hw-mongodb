import express from 'express';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userLoginSchema, userRegisterSchema } from '../schemas/auth.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(userRegisterSchema), registerUser);
authRouter.post('/login', validateBody(userLoginSchema), loginUser);
authRouter.post('/refresh', refreshSession);
authRouter.post('/logout', logoutUser);

export default authRouter;
