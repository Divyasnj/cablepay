import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['admin', 'operator'], default: 'operator' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
