// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'; // ✅ Add this line
import customerRoutes from './routes/customerRoutes';

import areaRoutes from './routes/areaRoutes';
import paymentRoutes from './routes/paymentRoutes';



dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // ✅ Allow frontend origin
  credentials: true
}));
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);

app.use('/api/customers', customerRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/payments', paymentRoutes);



// 🔘 Health Check Route
app.get('/', (_req, res) => {
  res.send('✅ CablePay Backend Running');
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
