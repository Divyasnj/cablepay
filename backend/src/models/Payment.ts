import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  customerId: mongoose.Types.ObjectId;
  name: string;
  month: string;
  date: Date;
  amount: number;
}

const paymentSchema = new Schema<IPayment>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  name: { type: String, required: true },
  month: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
});

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
