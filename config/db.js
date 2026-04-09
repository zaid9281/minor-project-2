const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is undefined. Check your Vercel Environment Variables.');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    // Don't kill the Vercel function entirely on failed DB connect immediately, as it prevents logging
    // process.exit(1);
  }
};

module.exports = connectDB;