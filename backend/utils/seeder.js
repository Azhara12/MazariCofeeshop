import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

dotenv.config();
connectDB();

const products = [
  {
    name: 'Caramel Macchiato',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=800',
    description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.',
    price: 4.99,
    category: 'Coffee',
    rating: 4.8,
    isPopular: true,
    options: {
      sizes: [{ name: 'Small', priceModifier: 0 }, { name: 'Medium', priceModifier: 0.50 }, { name: 'Large', priceModifier: 1.00 }],
      milks: ['Whole Milk', 'Skim Milk', 'Oat Milk', 'Almond Milk'],
      extraShots: 0.80
    }
  },
  {
    name: 'Iced Latte',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf0ba1cadc?auto=format&fit=crop&q=80&w=800',
    description: 'Our dark, rich espresso balanced with milk and served over ice.',
    price: 4.49,
    category: 'Cold Drinks',
    rating: 4.6,
    isPopular: true,
    options: {
      sizes: [{ name: 'Small', priceModifier: 0 }, { name: 'Medium', priceModifier: 0.50 }, { name: 'Large', priceModifier: 1.00 }],
      milks: ['Whole Milk', 'Skim Milk', 'Oat Milk', 'Almond Milk'],
      extraShots: 0.80
    }
  },
  {
    name: 'Classic Croissant',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
    description: 'Flaky, buttery pastry baked to a golden brown.',
    price: 3.29,
    category: 'Pastries',
    rating: 4.7,
    isPopular: false,
    options: {
      sizes: [],
      milks: [],
      extraShots: 0
    }
  },
  {
    name: 'Matcha Green Tea',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=800',
    description: 'Smooth and creamy matcha sweetened just right and served with steamed milk.',
    price: 5.29,
    category: 'Teas',
    rating: 4.9,
    isPopular: true,
    options: {
      sizes: [{ name: 'Small', priceModifier: 0 }, { name: 'Medium', priceModifier: 0.50 }, { name: 'Large', priceModifier: 1.00 }],
      milks: ['Whole Milk', 'Oat Milk', 'Soy Milk'],
      extraShots: 0
    }
  },
  {
    name: 'Chocolate Lava Cake',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=800',
    description: 'Rich chocolate cake with a molten center, served warm.',
    price: 6.99,
    category: 'Desserts',
    rating: 4.9,
    isPopular: true,
    options: {
      sizes: [],
      milks: [],
      extraShots: 0
    }
  }
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
