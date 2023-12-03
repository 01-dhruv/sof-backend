// In your server routes file
import express from 'express';
import { getLoginHistory } from '../controllers/LoginHist.js';

const router = express.Router();

// Add a route to fetch login history
router.get('/', getLoginHistory);

export default router;