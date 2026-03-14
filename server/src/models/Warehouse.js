import mongoose from 'mongoose';

const WarehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a warehouse name'],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    capacity: {
      type: Number,
      default: 1000,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Warehouse', WarehouseSchema);
