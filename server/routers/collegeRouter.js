import express from 'express';
import { getCollege, getDepartments, updateCollege } from '../controllers/collegeController.js';

const collegeRouter = express.Router();

collegeRouter.get('/:college_id', getCollege);
collegeRouter.get('/:college_id/departments', getDepartments);
collegeRouter.post('/:college_id/update', updateCollege);

export default collegeRouter;
