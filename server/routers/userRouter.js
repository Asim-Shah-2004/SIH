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

const userRouter = express.Router();

userRouter.get('/getAll', getAllUsers);
userRouter.get('/getAllexCon', getAllUsers);
userRouter.get('/donations', getDonations);
userRouter.get('/getDepartments', getDepartments);
userRouter.get('/fetch/:id', getUser);
userRouter.get('/fetchCollege/:id', getCollege);
userRouter.post('/changePassword', changePassword)
userRouter.post('/verifyPassword', verifyPassword)
userRouter.get('/getConfig/:college_id', landingPageConfig);

export default userRouter;
