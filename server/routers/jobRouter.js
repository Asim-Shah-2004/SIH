import express from "express";
import {
  getAllJobs,
  getJobById,
  addJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.get("/", getAllJobs);
jobRouter.get("/:id", getJobById);
jobRouter.post("/", addJob);
jobRouter.put("/:id", updateJob);
jobRouter.delete("/:id", deleteJob);

export default jobRouter;
