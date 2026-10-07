import mongoose from 'mongoose';

// Cache connection for serverless (Vercel reuses connections)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB: Using cached connection');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do NOT call process.exit(1) in serverless — it crashes the function
    throw error;
  }
};

export default connectDB;
