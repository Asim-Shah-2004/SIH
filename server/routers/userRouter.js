import express from 'express';
import {
  getAllUsers,
  getUser,
  getAllUsersExceptConnections,
  getDonations,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/getAll', getAllUsers);
userRouter.get('/getAllexCon', getAllUsers);
userRouter.get('/donations', getDonations);
userRouter.get('/fetch/:id', getUser);

export default userRouter;
