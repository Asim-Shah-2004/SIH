import express from 'express';
import { register, verify, login } from '../controllers/authController2.js';
import {collegeRegister,collegeLogin,userRegister,userLogin} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.get('/:email/verify', verify);
authRouter.post('/login', login)
authRouter.post('/collegeRegister', collegeRegister)
authRouter.post('/collegeLogin', collegeLogin)
authRouter.post('/alumniRegister', userRegister)
authRouter.post('/alumniLogin', userLogin)

export default authRouter;