import express from 'express';
import { register, verify, login } from '../controllers/authController2.js';
import {collegeRegister} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.get('/:email/verify', verify);
authRouter.post('/login', login)
authRouter.post('/collegeRegister', collegeRegister)

export default authRouter;
