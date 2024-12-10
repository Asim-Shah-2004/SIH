import express from 'express';
import {
  getAllUsers,
  getUser,
  getAllUsersExceptConnections,
  getDonations,
  verifyPassword,
  changePassword
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/getAll', getAllUsers);
userRouter.get('/getAllexCon', getAllUsers);
userRouter.get('/donations', getDonations);
userRouter.get('/fetch/:id', getUser);
userRouter.post('/changePassword',changePassword)
userRouter.post('/verifyPassword',verifyPassword)

export default userRouter;
