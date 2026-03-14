import mongoose from 'mongoose';

const AdjustmentSchema = new mongoose.Schema(
  {
    adjustmentNumber: {
      type: String,
      required: [true, 'Please provide an adjustment number'],
      unique: true,
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product ID'],
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Please provide a warehouse ID'],
    },
    quantityDifference: {
      type: Number,
      required: [true, 'Please provide a quantity difference'],
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason'],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'],
      default: 'DRAFT',
    },
  },
  { timestamps: true }
);

// Indexes
AdjustmentSchema.index({ productId: 1 });
AdjustmentSchema.index({ warehouseId: 1 });
AdjustmentSchema.index({ status: 1 });

export default mongoose.model('Adjustment', AdjustmentSchema);
