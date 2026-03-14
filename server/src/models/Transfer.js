import mongoose from 'mongoose';

const TransferSchema = new mongoose.Schema(
  {
    transferNumber: {
      type: String,
      required: [true, 'Please provide a transfer number'],
      unique: true,
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product ID'],
    },
    fromWarehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Please provide a source warehouse ID'],
    },
    toWarehouseId: {
      type: String,
      required: [true, 'Please provide a destination warehouse ID'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide a quantity'],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING', 'IN_TRANSIT', 'RECEIVED', 'COMPLETED', 'CANCELLED'],
      default: 'DRAFT',
    },
  },
  { timestamps: true }
);

// Indexes
TransferSchema.index({ productId: 1 });
TransferSchema.index({ fromWarehouseId: 1 });
TransferSchema.index({ status: 1 });

export default mongoose.model('Transfer', TransferSchema);
