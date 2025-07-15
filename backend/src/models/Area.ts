import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema(
  {
    areaName: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Normalize areaName to lowercase
areaSchema.pre('save', function (next) {
  this.areaName = this.areaName.toLowerCase().trim();
  next();
});

const Area = mongoose.model('Area', areaSchema);
export default Area;
