import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  createPaymentIntent
} from '../controllers/orderController.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Create New Order
router.post('/', protect, createOrder);

// 2. Get Logged-in Customer's Orders
router.get('/myorders', protect, getMyOrders);

// 3. Create Stripe Payment Intent
router.post('/create-payment-intent', createPaymentIntent);

// 4. Get All Orders (Admin Panel ke liye)
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Get Single Order By ID
router.get('/:id', protect, getOrderById);

// 6. Update Order Status (Admin)
router.patch('/:id/status', protect, updateOrderStatus);

export default router;