import express from 'express';
import { register, verify, login } from '../controllers/authController2.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.get('/:email/verify', verify);
authRouter.post('/login', login)

export default authRouter;
