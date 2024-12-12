import express from 'express';
import {
addJob,
deleteJob,
applyJob,
getAllCollegeJobs,
getJobById
} from '../controllers/jobController.js';

const jobRouter = express.Router();

jobRouter.get('/:job_id', getJobById);
jobRouter.delete('/:job_id', deleteJob);
jobRouter.post('/:college_id/:userId', addJob);

jobRouter.get('/apply/:job_id/:userId', applyJob);
jobRouter.get('/college/:college_id', getAllCollegeJobs);

export default jobRouter;
