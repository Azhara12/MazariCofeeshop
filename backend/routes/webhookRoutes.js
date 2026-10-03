import express from 'express';
import { stripeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// We need the raw body for Stripe signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
