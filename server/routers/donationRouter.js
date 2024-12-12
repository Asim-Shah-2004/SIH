import express from 'express';
import {
  getAllDonationCampaigns,
  getDonationCampaignById,
  addDonationCampaign,
  updateDonationCampaign,
  deleteDonationCampaign,
  donateToCampaign,
  getDonors,
} from '../controllers/donationController.js';

import { authenticateToken } from '../middleware/authenticateToken.js';

const donationCampaignRouter = express.Router();

donationCampaignRouter.get('/:college_id', getAllDonationCampaigns);
donationCampaignRouter.get('/:id',authenticateToken ,getDonationCampaignById);
donationCampaignRouter.post('/',authenticateToken ,addDonationCampaign);
donationCampaignRouter.put('/:id',authenticateToken ,updateDonationCampaign);
donationCampaignRouter.delete('/:id',authenticateToken ,deleteDonationCampaign);
donationCampaignRouter.post('/:id/donate',authenticateToken ,donateToCampaign);
donationCampaignRouter.get('/:id/getDonors',authenticateToken ,getDonors);

export default donationCampaignRouter;
