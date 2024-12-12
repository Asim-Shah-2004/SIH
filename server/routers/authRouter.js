import express from 'express';
import {
  collegeLogin,
  collegeRegister,
  userLogin,
  userRegister,
  bulkCreateUsers,
} from '../controllers/authController.js';
import { verify } from '../controllers/authController2.js';

const authRouter = express.Router();

authRouter.post('/college/login', collegeLogin);
authRouter.post('/college/register', collegeRegister);
authRouter.post('/user/login', userLogin);
authRouter.post('/user/register', userRegister);

authRouter.get('/:email/verify', verify);
authRouter.post('/bulkcreateusers', bulkCreateUsers);

export default authRouter;
