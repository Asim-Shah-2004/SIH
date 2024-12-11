import express from 'express';
import { register, verify } from '../controllers/authController2.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.get('/:email/verify', verify);

export default authRouter;
