import express from 'express';
import {
  getAllUsers,
  getUser,
  getAllUsersExceptConnections,
  getDonations,
  verifyPassword,
  changePassword,
  getDepartments,
  landingPageConfig,
  getCollege
} from '../controllers/userController.js';

import { authenticateToken } from '../middleware/authenticateToken.js';

const userRouter = express.Router();

userRouter.get('/getConfig/:college_id', landingPageConfig);

userRouter.get('/getAll', authenticateToken, getAllUsers);
userRouter.get('/getAllexCon', authenticateToken, getAllUsers);
userRouter.get('/donations', authenticateToken, getDonations);
userRouter.get('/getDepartments', authenticateToken, getDepartments);
userRouter.get('/fetch/:id', authenticateToken, getUser);
userRouter.post('/changePassword', authenticateToken, changePassword)
userRouter.post('/verifyPassword', authenticateToken, verifyPassword)
userRouter.get('/fetchCollege/:id', authenticateToken, getCollege)



export default userRouter;
