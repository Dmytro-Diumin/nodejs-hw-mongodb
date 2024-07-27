import express from 'express';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  resetPasswordController,
  requestResetEmailController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userLoginSchema, userRegisterSchema } from '../schemas/auth.js';
import { resetEmailSchema } from '../schemas/resetEmailShema.js';
import { resetPasswordSchema } from '../schemas/resetPasswordSchema.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';


const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(userRegisterSchema),
  ctrlWrapper(registerUser),
);
authRouter.post(
  '/login',
  validateBody(userLoginSchema),
  ctrlWrapper(loginUser),
);
authRouter.post('/refresh', ctrlWrapper(refreshSession));
authRouter.post('/logout', ctrlWrapper(logoutUser));

authRouter.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
