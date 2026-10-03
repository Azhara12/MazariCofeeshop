import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderId: { type: String, required: true, unique: true },
    customerDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    orderItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        milk: { type: String },
        sweetness: { type: String, default: '100%' }, // Added for Coffee Customization
        extraShots: { type: Number, default: 0 },
        image: { type: String },
      },
    ],
    deliveryMethod: {
      type: String,
      required: true,
      enum: ['Dine-in', 'Takeaway', 'Home Delivery'],
    },
    deliveryAddress: {
      address: { type: String },
      city: { type: String },
      instructions: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'Card'],
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    stripePaymentIntentId: { type: String },
    stripeChargeId: { type: String },
    pricing: {
      subtotal: { type: Number, required: true },
      tax: { type: Number, required: true },
      shippingFee: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },
    orderStatus: {
      type: String,
      enum: ['Order Received', 'Brewing', 'On the Way', 'Delivered', 'Cancelled'],
      default: 'Order Received',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;