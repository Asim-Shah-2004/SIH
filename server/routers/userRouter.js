import express from 'express';
import {
  getUser,
  getAllUsers,
  getAllAlumni,
  changePassword,
  getAllUsersExceptConnections,
  getDonations,
  landingPageConfig,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/getConfig/:college_id', landingPageConfig);

userRouter.get('/getAll/:id', getAllUsers);
userRouter.get('/getAllAlumni/:college_id', getAllUsers);
userRouter.get('/getAllexCon/:id', getAllUsersExceptConnections);
userRouter.get('/donations/:userId', getDonations);
userRouter.get('/fetch/:id', getUser);
userRouter.post('/changePassword/:userId', changePassword);

export default userRouter;
