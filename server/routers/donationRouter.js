import express from 'express';
import {
  getAllDonationCampaigns,
  getDonationCampaignById,
  addDonationCampaign,
  updateDonationCampaign,
  deleteDonationCampaign,
  donateToCampaign,
} from '../controllers/donationController.js';

const donationCampaignRouter = express.Router();

donationCampaignRouter.get('/', getAllDonationCampaigns);
donationCampaignRouter.get('/:id', getDonationCampaignById);
donationCampaignRouter.post('/', addDonationCampaign);
donationCampaignRouter.put('/:id', updateDonationCampaign);
donationCampaignRouter.delete('/:id', deleteDonationCampaign);
donationCampaignRouter.post('/:id/donate', donateToCampaign);

export default donationCampaignRouter;
