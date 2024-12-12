import express from 'express';
import {
  getAllCollegeDonationCampaigns,
  getDonationCampaignById,
  addDonationCampaign,
  deleteDonationCampaign,
  donateToCampaign,
  getDonors,
} from '../controllers/donationController.js';

const donationCampaignRouter = express.Router();

donationCampaignRouter.get('/:college_id', getAllCollegeDonationCampaigns);
donationCampaignRouter.post('/:college_id', addDonationCampaign);
donationCampaignRouter.delete('/:college_id', deleteDonationCampaign);
donationCampaignRouter.get('/:id/single', getDonationCampaignById);

donationCampaignRouter.post('/:id/donate', donateToCampaign);
donationCampaignRouter.get('/:id/getDonors', getDonors);

export default donationCampaignRouter;
