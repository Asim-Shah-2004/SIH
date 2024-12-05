import express from 'express';
import { getAllUsers, getUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/getAll', getAllUsers);
userRouter.get('/:email', getUser);

export default userRouter;