import express from 'express';
import { updateCollege } from '../controllers/collegeController.js';

const collegeRouter = express.Router();

collegeRouter.patch('/:id/update', updateCollege);

export default collegeRouter;
