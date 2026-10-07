import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
// Allow: localhost dev, any *.vercel.app subdomain, and FRONTEND_URL env var
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    const allowedPatterns = [
      /^https?:\/\/localhost(:\d+)?$/,           // localhost any port
      /^https:\/\/.*\.vercel\.app$/,             // any *.vercel.app
    ];

    // Also allow explicit FRONTEND_URL if set
    if (process.env.FRONTEND_URL) {
      try {
        allowedPatterns.push(new RegExp(`^${process.env.FRONTEND_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
      } catch (_) {}
    }

    const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

// Webhook route MUST be before express.json() because Stripe needs the raw body
import webhookRoutes from './routes/webhookRoutes.js';
app.use('/api/webhooks', webhookRoutes);

// Body parser
app.use(express.json());

// Mount routers
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('MazariCS API is running...');
});

// Error handling middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only listen when not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
