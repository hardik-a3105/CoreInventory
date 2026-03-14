import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Please provide a warehouse ID'],
    },
    name: {
      type: String,
      required: [true, 'Please provide a location name'],
    },
    type: {
      type: String,
      enum: ['rack', 'shelf', 'bin', 'floor'],
      default: 'rack',
    },
  },
  { timestamps: true }
);

// Indexes
LocationSchema.index({ warehouseId: 1 });

export default mongoose.model('Location', LocationSchema);
