import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Coffee', 'Cold Drinks', 'Teas', 'Pastries', 'Desserts', 'Snacks'],
    },
    image: { type: String },
    rating: { type: Number, default: 4.5 },
    options: {
      sizes: [{ name: String, priceModifier: Number }],
      milks: [String],
      extraShots: { type: Number, default: 0 } // representing price modifier per extra shot
    },
    isPopular: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
