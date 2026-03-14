import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: [true, 'Please provide a receipt number'],
      unique: true,
      trim: true,
    },
    supplierId: {
      type: String,
      default: '',
    },
    supplierName: {
      type: String,
      default: '',
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product ID'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide a quantity'],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'IN_TRANSIT', 'RECEIVED', 'VALIDATED', 'REJECTED'],
      default: 'DRAFT',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
  },
  { timestamps: true }
);

// Indexes
ReceiptSchema.index({ productId: 1 });
ReceiptSchema.index({ status: 1 });

export default mongoose.model('Receipt', ReceiptSchema);
