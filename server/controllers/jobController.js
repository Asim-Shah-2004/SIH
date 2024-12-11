import { Job } from '../models/index.js';

export const getAllJobs = async (req, res) => {
  try {
    // Extract the college_id from query parameters
    const { college_id } = req.params;

    // Validate the presence of college_id
    if (!college_id) {
      return res.status(400).json({ error: "college_id is required" });
    }

    // Query the database for jobs with the provided college_id
    const jobs = await Job.find({ college_id });

    // Check if jobs exist for the given college_id
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for the provided college_id" });
    }

    // Send the jobs data in the response
    res.status(200).json(jobs);
  } catch (error) {
    // Log the error and return an appropriate error response
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};


export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const job = await Job.findOne({ id });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ error: 'Invalid job ID' });
  }
};

export const addJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Failed to create job', details: error.message });
    console.log(error);

  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedJob) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({
      error: 'Invalid job ID or failed to update job',
      details: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findOneAndDelete({ id });
    if (!deletedJob) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid job ID or failed to delete job' });
  }
};
