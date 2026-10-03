import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getAdminOrders,
  updateOrderStatus,
  getAdminStats,
  makeAdmin,
  getSettings,
  updateSettings,
} from '../controllers/adminController.js';

const router = express.Router();

// All routes below this line are protected by admin middleware
router.use(protect, admin);

router.route('/orders').get(getAdminOrders);
router.route('/orders/:id/status').patch(updateOrderStatus);
router.route('/stats').get(getAdminStats);
router.route('/make-admin').post(makeAdmin);
router.route('/settings').get(getSettings).put(updateSettings);

export default router;
