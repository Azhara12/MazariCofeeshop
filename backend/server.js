// ─── All imports must be at the top in ES modules ────────────────────────────
import dns from 'dns';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import webhookRoutes from './routes/webhookRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// ─── DNS fix (must run after imports are resolved) ───────────────────────────
dns.setServers(['8.8.8.8', '8.8.4.4']);

// ─── Load env vars ────────────────────────────────────────────────────────────
dotenv.config();

// ─── Connect to database (non-blocking for serverless) ───────────────────────
connectDB().catch((err) => console.error('DB connection failed:', err.message));

// ─── Express App ──────────────────────────────────────────────────────────────
const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allows: localhost (any port), any *.vercel.app, and explicit FRONTEND_URL
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / mobile / server-to-server

    const allowedPatterns = [
      /^https?:\/\/localhost(:\d+)?$/,   // localhost any port
      /^https:\/\/.*\.vercel\.app$/,     // any *.vercel.app subdomain
    ];

    if (process.env.FRONTEND_URL) {
      try {
        allowedPatterns.push(
          new RegExp(
            `^${process.env.FRONTEND_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`
          )
        );
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
app.options(/(.*)/, cors(corsOptions)); // Handle preflight for all routes (Express v5 compatible)

// ─── Webhook route (BEFORE express.json — Stripe needs raw body) ──────────────
app.use('/api/webhooks', webhookRoutes);

// ─── Body parser ──────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// ─── Root health check ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('MazariCS API is running...');
});

// ─── Error handling middleware ────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start server (only outside Vercel serverless) ───────────────────────────
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });
}

export default app;
