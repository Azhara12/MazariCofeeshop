import Order from "../models/Order.js";
import Stripe from "stripe";

let stripe;

const getStripe = () => {
  if (!stripe) {
    const rawKey = process.env.STRIPE_SECRET_KEY || "";
    const cleanKey = rawKey.trim();

    if (!cleanKey) {
      throw new Error("STRIPE_SECRET_KEY is missing in backend .env file");
    }

    stripe = new Stripe(cleanKey);
  }
  return stripe;
};

// @desc    Create Stripe Payment Intent
// @route   POST /api/orders/create-payment-intent
export const createPaymentIntent = async (req, res, next) => {
  try {
    const stripeInstance = getStripe();
    const { amount } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      res.status(400);
      throw new Error("Valid order amount is required");
    }

    // Convert dollars to cents safely
    const numericAmount = Number(amount);
    const amountInCents =
      numericAmount < 1000 && String(numericAmount).includes(".")
        ? Math.round(numericAmount * 100)
        : Math.round(numericAmount);

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      intentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Stripe Server Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (protect middleware required)
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderId,
      customerDetails,
      orderItems,
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
      stripePaymentIntentId,
      pricing,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items found');
    }

    // req.user is guaranteed by the 'protect' middleware on this route
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      res.status(401);
      throw new Error('Not authorized: user ID not found. Please log in again.');
    }

    console.log(`[createOrder] Linking order to user: ${userId}`);

    const generatedOrderId =
      orderId || `#MZR-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = new Order({
      user: userId, // Always links to the authenticated user's MongoDB _id
      orderId: generatedOrderId,
      customerDetails,
      orderItems,
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
      stripePaymentIntentId,
      pricing,
      paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Pending',
    });

    const createdOrder = await order.save();
    console.log(`[createOrder] ✅ Order ${createdOrder.orderId} saved for user ${userId}`);
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    // 1. Guard check: Check if req.user exists safely
    if (!req.user || (!req.user._id && !req.user.id)) {
      return res.status(200).json([]);
    }

    const userId = req.user._id || req.user.id;

    // 2. Fetch authenticated user's orders
    const orders = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("[getMyOrders Error]:", error.message);
    next(error);
  }
};

// @desc    Get all orders (Admin Panel)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("[getAllOrders Error]:", error.message);
    next(error);
  }
};

// @desc    Get order by ID or orderId
// @route   GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order =
      (await Order.findOne({ orderId: req.params.id })) ||
      (await Order.findById(req.params.id));

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const VALID_STATUSES = [
      'Order Received',
      'Brewing',
      'On the Way',
      'Delivered',
      'Cancelled',
    ];

    if (!orderStatus || !VALID_STATUSES.includes(orderStatus)) {
      return res.status(400).json({
        message: `Invalid status "${orderStatus}". Must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    // Find then update atomically — avoids full-document re-validation
    let existingOrder = null;

    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      existingOrder = await Order.findById(id);
    }
    if (!existingOrder) {
      existingOrder = await Order.findOne({ orderId: id });
    }
    if (!existingOrder) {
      return res.status(404).json({ message: `Order not found with id: ${id}` });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      existingOrder._id,
      { $set: { orderStatus } },
      { new: true }
    );

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('[orderController] updateOrderStatus ERROR:', error.name, '-', error.message);
    next(error);
  }
};