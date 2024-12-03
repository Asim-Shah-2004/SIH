import express from 'express';
import {
  getAllDonationCampaigns,
  getDonationCampaignById,
  addDonationCampaign,
  updateDonationCampaign,
  deleteDonationCampaign,
} from '../controllers/donationController.js';

const donationRouter = express.Router();

donationRouter.get('/', getAllDonationCampaigns);
donationRouter.get('/:id', getDonationCampaignById);
donationRouter.post('/', addDonationCampaign);
donationRouter.put('/:id', updateDonationCampaign);
donationRouter.delete('/:id', deleteDonationCampaign);

export default donationRouter;
