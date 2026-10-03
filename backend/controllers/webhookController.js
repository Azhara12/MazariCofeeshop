import Order from '../models/Order.js';
import Stripe from 'stripe';

let stripe;

// @desc    Handle Stripe Webhooks
// @route   POST /api/webhooks/stripe
// @access  Public
const stripeWebhook = async (req, res, next) => {
  try {
    if (!stripe) {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Find the order that was paid for based on the payment intent ID
        const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
        
        if (order) {
          order.paymentStatus = 'Paid';
          order.orderStatus = 'Brewing';
          order.stripeChargeId = paymentIntent.latest_charge;
          await order.save();
          console.log(`Order ${order.orderId} payment succeeded and status updated to Brewing.`);
        } else {
          console.warn(`Order with PaymentIntent ${paymentIntent.id} not found.`);
        }
        break;
      
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        const failedOrder = await Order.findOne({ stripePaymentIntentId: failedPaymentIntent.id });
        if (failedOrder) {
          failedOrder.paymentStatus = 'Failed';
          await failedOrder.save();
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
  } catch (error) {
    next(error);
  }
};

export { stripeWebhook };
