import express from 'express';
import { createNewGroup } from '../controllers/groupController.js';

const groupRouter = express.Router();

groupRouter.post('/create', createNewGroup);

export default groupRouter;
