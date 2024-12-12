import { Job, User } from '../models/index.js';

export const getAllCollegeJobs = async (req, res) => {
  try {
    const { college_id } = req.params;

    if (!college_id) {
      return res.status(400).json({ error: 'College id is required' });
    }

    const jobs = await Job.find({ college_id })
      .populate('college_id')
      .populate('postedBy');

    if (!jobs || jobs.length === 0) {
      return res
        .status(404)
        .json({ message: 'No jobs found for the provided college_id' });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { job_id } = req.params;
    const job = await Job.findOne({ id: job_id });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ error: 'Invalid job ID' });
  }
};

export const addJob = async (req, res) => {
  try {
    const { college_id, userId } = req.params;
    const user = await User.findById(userId);
    console.log(user);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const newJob = new Job(req.body);
    newJob.postedBy = user._id;
    user.jobsPosted.push(newJob._id);
    newJob.college_id = college_id;
    const savedJob = await newJob.save();

    res.status(201).json(savedJob);
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Failed to create job', details: error.message });
    console.log(error);
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { job_id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(job_id);

    if (!deletedJob) return res.status(404).json({ error: 'Job not found' });

    await User.updateMany({ jobsApplied: job_id }, { $pull: { jobsApplied: job_id } });
    await User.updateMany({ jobsPosted: job_id }, { $pull: { jobsPosted: job_id } });

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid job ID or failed to delete job' });
  }
};

export const applyJob = async (req, res) => {
  try {
    const { job_id, userId } = req.params;
    const job = await Job.findById(job_id);
    const user = await User.findById(userId);

    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    job.applicants.push(user._id);
    user.jobsApplied.push(job._id);
    await job.save();
    await user.save();

    res.status(200).json({ message: 'Job application successful' });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Failed to apply for job', details: error.message });
  }
};
