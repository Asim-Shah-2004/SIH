import express from 'express';
import { getAllUsers, getUser, getAllUsersExceptConnections } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/getAll', getAllUsers);
userRouter.get('/getAllexCon', getAllUsers);
userRouter.get('/:id', getUser);

export default userRouter;
